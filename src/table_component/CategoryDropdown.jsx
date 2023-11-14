import { useState,useEffect } from "react";

export const CategoryDropdown = ({newItem,setNewItem}) => {
    const categoryOptions = ["指定なし", "技術ブログ", "技術書", "技術系動画"];
    const [isOpenCategory,setIsOpenCategory] = useState(false);
    const clickCategory = (number) => {
        setNewItem(
            prevItem => ({...prevItem,category:number})
        );
        setIsOpenCategory(false);
    };
    return(
        <div>
            <button className="dropdownbutton" onClick={() => setIsOpenCategory(!isOpenCategory)}>category:{categoryOptions[newItem.category]}</button>
            <ul hidden={!isOpenCategory}>
                <button className="dropdownbutton" onClick={()=>clickCategory(1)}>blog</button>
                <button className="dropdownbutton" onClick={()=>clickCategory(2)}>book</button>
                <button className="dropdownbutton" onClick={()=>clickCategory(3)}>movie</button>
            </ul>
        </div>
    );
};

export default CategoryDropdown;