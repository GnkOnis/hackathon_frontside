import { useState, useEffect } from "react";
import { fireAuth } from "./firebase.ts";
import { useNavigate } from "react-router-dom";
import { PopupForGet } from "./table_component/PopupForGet";
import { CategoryDropdown } from "./table_component/CategoryDropdown.jsx"
import CurrDropdown, { currDropdown } from "./table_component/CurrDropdown.jsx";
import "./css/Table.css"
//import "./Main.css";

export function Table() {
    //ログイン情報
    const [formData, setFormData] = useState({
        name: fireAuth.currentUser.displayName,
        email: fireAuth.currentUser.email,
    });
    const { name, email } = formData;
    //useStateの定義
    const [data,setData] = useState([]);
    const [selectedItemId,setSelectedItemId] = useState(null);
    const [newItem,setNewItem] = useState({title:'', category:0, curr:0, link:'', comment:'', name:''})
    //Getリクエストのクエリ変数
    const [order, setOrder] = useState(0);
    const [category, setCategory] = useState(0);
    const [curriculum, setCurriculum] = useState(0);
    
    const navigate = useNavigate();
    const onLogout = () => {
        fireAuth.signOut();
        navigate("/");
    }

    //バックエンドからデータを取得
    useEffect(() => {
        const apiUrl = `https://hackathon-backside-s4qwumw5dq-uc.a.run.app/table?order=${order}&category=${category}&curr=${curriculum}`;
        // const apiUrl = `http://localhost:8000/table?order=${order}&category=${category}&curr=${curriculum}`;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('データの取得に失敗しました:',error);
            });
    },[order,category,curriculum])

    //新しいアイテムを作成
    const handleCreateItem = () => {
        const newItemWithInt = {
            title: newItem.title,
            category: parseInt(newItem.category, 10),
            curr: parseInt(newItem.curr, 10),
            link: newItem.link,
            comment: newItem.comment,
            name: newItem.name
        };

        fetch("https://hackathon-backside-s4qwumw5dq-uc.a.run.app/table",{
            method: 'POST',
            headers:{'Content-Type':'application/json',
            },
            body: JSON.stringify(newItemWithInt)
        })
            .then(response => response.json())  //かえってくるjsonは配列でないためエラーをはくかも
            .then(createdItem => {
                setData([...data,createdItem]);
                setNewItem({title:'', category:0, curr:0, link:'', comment:'', name:''}) //curr,linkの型指定しないとエラーはくかも
            })
            .catch(error => {
                console.error('アイテムの作成に失敗しました:',error);
            });
    };

    //選択されたアイテムを更新
    //category: parseInt(newItem.category, 10),
    const handleUpdateItem = () => {
        const updateData = {
            id: selectedItemId,
            title: newItem.title ? newItem.title : 'nochange',
            // category: parseInt(newItem.category ? newItem.category : 100, 10),
            // curr: parseInt(newItem.curr ? newItem.curr : 100,10),
            category: newItem.category ? Number(newItem.category) : 100,
            curr: newItem.curr ? Number(newItem.curr) : 100,
            link: newItem.link ? newItem.link : 'nochange',
            name: newItem.name ? newItem.name : 'nochange'
        };
        console.log(updateData);
        fetch('https://hackathon-backside-s4qwumw5dq-uc.a.run.app/table',{
            method:'PUT',
            headers:{'Content-Type':'application/json',},
            body:JSON.stringify(updateData),
        })
            .then(response => response.json())
            .then(updatedItem => {
                const updatedData = data.map(item =>
                    item.id === selectedItemId ? updatedItem : item
                );
                setData(updatedData);
                setNewItem({title:'', category:0, curr:0, link:'', comment:'', name:''})
                setSelectedItemId(null); // 編集モードを終了
            })
            .catch(error => {
                console.error('アイテムの更新に失敗しました: ',error)
            });
    };

    //選択されたアイテムを削除
    const handleDeleteItem = (itemId) => {
        const deleteUrl = `https://hackathon-backside-s4qwumw5dq-uc.a.run.app/table?id=${itemId}`;
        fetch(deleteUrl,{
            method:'DELETE',
        })
            .then(() => {
                const updatedData = data.filter(item => item.id !== itemId);
                setData(updatedData);
                setSelectedItemId(null); // 削除後、選択を解除
            })
            .catch(error => {
                console.error('アイテムの削除に失敗しました: ',error)
            });
    };

    function getTitleById(data, id) {
        const item = data.find(item => item.id === id);
        return item ? item.title : null; // 該当するアイテムが見つかった場合はtitleを返し、見つからない場合はnullを返す
    }

    return (
        <div>
            <header>
                <div className="header-left">
                    <p>UTTC Knowledgebase</p>
                </div>
                <div className="right-group">
                    <div className="header-right">
                        <ul className="user_mail">ログインユーザー名: {name}</ul>
                        <ul className="user_mail">ログインメール: {email}</ul>
                    </div>
                    <button className="header-right" type="button_header" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <div className="popupforget" style={{marginTop:'80px'}}>
                <PopupForGet
                    order={order}
                    setOrder={setOrder}
                    category={category}
                    setCategory={setCategory}
                    curriculum={curriculum}
                    setCurriculum={setCurriculum}
                />
            </div>            
            <table>
                <thead>
                    <tr>
                        <th>タイトル</th>
                        <th>カテゴリー</th>
                        <th>カリキュラム</th>
                        <th>リンク</th>
                        <th>作成</th>
                        <th>更新</th>
                        <th>コメント数</th>
                        <th>要約</th>
                        <th>コンテンツの作成者</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                    data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>
                                {
                                    item.category === 1 ? 'Blog':
                                    item.category === 2 ? 'Book':
                                    item.category === 3 ? 'movie':
                                    'no registration'
                                }
                            </td>
                            <td>
                                {
                                    item.curr === 0 ? 'すべて':
                                    item.curr === 1 ? 'その他':
                                    item.curr === 2 ? 'エディタ(IDE)':
                                    item.curr === 3 ? 'OSコマンド(とシェル)':
                                    item.curr === 5 ? 'Git':
                                    item.curr === 6 ? 'Github':
                                    item.curr === 7 ? 'HTML&CSS':
                                    item.curr === 8 ? 'JavaScript':
                                    item.curr === 9 ? 'React':
                                    item.curr === 10 ? 'React x TypeScript':
                                    item.curr === 11 ? 'SQL':
                                    item.curr === 12 ? 'Docker':
                                    item.curr === 13 ? 'Go':
                                    item.curr === 14 ? 'HTTP Server(Go)':
                                    item.curr === 15 ? 'RDBMS(MySQL)への接続':
                                    item.curr === 16 ? 'Unit Test(Go)':
                                    item.curr === 17 ? 'フロントとバックの接続':
                                    item.curr === 18 ? 'CI':
                                    item.curr === 19 ? 'CD':
                                    item.curr === 20 ? '認証':
                                    item.curr === 21 ? 'ハッカソン準準':
                                    item.curr === 22 ? 'ハッカソンの概要':
                                    item.curr === 23 ? 'インターン準備編':
                                    item.curr === 24 ? 'DB編':
                                    item.curr === 25 ? 'method & interfaceを学ぶ':
                                    item.curr === 26 ? 'ソースコードの改善':
                                    item.curr === 27 ? 'フロントにおける設計と状態管理':
                                    item.curr === 28 ? 'Vim':"error"
                                }
                            </td>
                            <td>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    link
                                </a>
                            </td>
                            <td>{item.createtime}</td>
                            <td>{item.updatetime}</td>
                            <td>{item.numcomment}</td>
                            <td>{item.summary}</td>
                            <td>{item.name}</td>
                            <td>
                                <button onClick={() => setSelectedItemId(item.id)}>update</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </td>
                            <td>
                                <button className="detail-button" onClick={() => navigate("./element",{state:{ item }})}>detail</button>
                            </td>
                        </tr>
                    ))
                    ) : (
                        <p>No data available</p>
                    )}
                </tbody>
            </table>
            {selectedItemId !== null ? (
                <div className="inputdata">
                    <h2 className="upadatecontents">Edit Item : {getTitleById(data, selectedItemId)}</h2>
                    <label htmlFor="title">Title:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.title}
                    onChange={(e) => setNewItem({...newItem,title: e.target.value})}
                    />
                    <CategoryDropdown 
                    newItem={newItem}
                    setNewItem={setNewItem}
                    />
                    {/* <label htmlFor="category">Category:</label>
                    <input className="upadateinput"
                    type = "number"
                    value = {newItem.category}
                    onChange={(e) => setNewItem({...newItem,category: e.target.value})}
                    /> */}
                    <CurrDropdown
                    newItem={newItem}
                    setNewItem={setNewItem}
                    />
                    {/* <label htmlFor="curr">Curriculum:</label>
                    <input className="upadateinput"
                    type = "number"
                    value = {newItem.curr}
                    onChange={(e) => setNewItem({...newItem,curr: e.target.value})}
                    /> */}
                    <label htmlFor="link">Link:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.link}
                    onChange={(e) => setNewItem({...newItem,link: e.target.value})}
                    />
                    <label htmlFor="name">Name:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.name}
                    onChange={(e) => setNewItem({...newItem,name: e.target.value})}
                    />
                    <button className="upadatecontents" onClick={handleUpdateItem}>Save Changes</button>
                </div>
            ) : (
                <div className="inputdata">
                    <h2 className="upadatecontents">Create New Item</h2>
                    <label htmlFor="title">Title:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.title}
                    onChange={(e) => setNewItem({...newItem,title: e.target.value})}
                    />
                    <CategoryDropdown 
                    newItem={newItem}
                    setNewItem={setNewItem}
                    />
                    <CurrDropdown
                    newItem={newItem}
                    setNewItem={setNewItem}
                    />
                    <label htmlFor="link">Link:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.link}
                    onChange={(e) => setNewItem({...newItem,link: e.target.value})}
                    />
                    <label htmlFor="comment">Comment:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.comment}
                    onChange={(e) => setNewItem({...newItem,comment: e.target.value})}
                    />
                    <label htmlFor="name">Name:</label>
                    <input className="upadateinput"
                    type = "text"
                    value = {newItem.name}
                    onChange={(e) => setNewItem({...newItem,name: e.target.value})}
                    />
                    <button className="upadatecontents" onClick={handleCreateItem}>Create</button>
                </div>
            )}
        </div>
    );
}

export default Table;
