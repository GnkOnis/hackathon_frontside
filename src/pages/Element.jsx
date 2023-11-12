import { useState, useEffect } from "react";
import { fireAuth } from "./../firebase.ts";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function Element() {
    //遷移元から情報を取得
    const location = useLocation();
    const { item } = location.state;
    //ログイン情報
    const [formData, setFormData] = useState({
        name: fireAuth.currentUser.displayName,
        email: fireAuth.currentUser.email,
    });
    const { name, email } = formData;
    //useStateの定義
    const [data,setData] = useState([]);
    const [newItem,setNewItem] = useState({name:'',comment:''})

    const navigate = useNavigate();
    const onLogout = () => {
        fireAuth.signOut();
        navigate("/");
    }
    //バックエンドからデータを取得
    useEffect(() => {
        const apiUrl =`https://hackathon-backside-s4qwumw5dq-uc.a.run.app/element?parent_id=${item.id}`;
        console.log(apiUrl)
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.log('データの取得に失敗しました',error);
            });
    },[])
    //新しいアイテムを作成
    const handleCreateItem = () => {
        const newItemPost = {
            name:newItem.name,
            comment:newItem.comment
        };
        fetch(`https://hackathon-backside-s4qwumw5dq-uc.a.run.app/element?parent_id=${item.id}`,{
            method:'POST',
            headers:{'Content-Type':'application/json',},
            body:JSON.stringify(newItemPost)
        })
            .then(() => {
                setData([...data,newItemPost]);
                setNewItem({name:'',comment:''});
            })
            .catch(error => {
                console.error('アイテムの作成に失敗しました:',error)
            }); 
    };
    //選択されたアイテムを削除
    const handleDeleteItem = (itemId) => {
        fetch(`https://hackathon-backside-s4qwumw5dq-uc.a.run.app/element?parent_id=${item.id}&id=${itemId}`,{
            method:'DELETE',
        })
            .then(() => {
                const updatedData = data.filter(i => i.id !== itemId);
                setData(updatedData);
            })
                .catch(error => {
                    console.error('アイテムの削除に失敗しました:',error)
                });
    };

    return(
        <div>
            <p>elementpageに遷移が成功しました</p>
            <p>UTTC Knowledgebase</p>
            <p>ログインユーザー名: {name}</p>
            <p>ログインメール: {email}</p>
            <button type="button" onClick={onLogout}>
                Logout
            </button>
            <button onClick={() => navigate("/main")}>一覧に戻る</button>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>comment</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((i) => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{i.comment}</td>
                                <td>
                                    <button onClick={() => handleDeleteItem(i.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <p>No comment</p>
                    )}
                </tbody>
            </table>
            <div>
                <h2>Create New Comment</h2>
                <label >Name</label>
                <input
                type = "text"
                value = {newItem.name}
                onChange={(e) => setNewItem({...newItem,name: e.target.value})}
                />
                <label >Comment</label>
                <input
                type = "text"
                value = {newItem.comment}
                onChange={(e) => setNewItem({...newItem,comment: e.target.value})}
                />
                <button onClick={handleCreateItem}>Post Commment</button>
            </div>
            {/* <body>
                <iframe class= "frame_center" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2578.937859761149!2d139.74313891986267!3d35.658298770108985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bbd9009ec09%3A0x481a93f0d2a409dd!2z5p2x5Lqs44K_44Ov44O8!5e0!3m2!1sja!2sjp!4v1601530511262!5m2!1sja!2sjp" width="400" height="400" frameborder="0" style={{border:0}} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
            </body> */}
        </div>
    );
}

export default Element;