import { useState } from "react";

export const CurrDropdown = ({newItem,setNewItem}) => {
    const currOptions = ["指定なし", "その他",'エディタ(IDE)','OSコマンド(とシェル)','Git','Github','HTML&CSS','JavaScript','React','React x TypeScript','SQL','Docker','Go','HTTP Server(Go)','RDBMS(MySQL)への接続','Unit Test(Go)','フロントとバックの接続','CI','CD','認証','ハッカソン準準','ハッカソンの概要','インターン準備編','DB編','method & interfaceを学ぶ','ソースコードの改善','フロントにおける設計と状態管理','Vim'];
    const [isOpenCurr,setIsOpenCurr] = useState(false);
    const clickCurr = (number) => {
        setNewItem(
            prevItem => ({...prevItem,curr:number})
        );
        setIsOpenCurr(false);
    };
    return(
        <div>
            <button className="dropdownbutton" onClick={() => setIsOpenCurr(!isOpenCurr)}>curr:{currOptions[newItem.curr]}</button>
            <ul hidden={!isOpenCurr}>
                {currOptions.map((option, index) => (
                <button key={index} className="dropdownbutton" onClick={() => clickCurr(index)}>{option}</button>
                ))}
            </ul>
        </div>
    );
};

export default CurrDropdown;