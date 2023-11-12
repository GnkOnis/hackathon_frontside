import React, { useState } from "react";
import "./../css/PopupForGet.css"

const RadioPopup = ({ options, selected, onSelect }) => {
  return (
    <div className="popup">
      {options.map((option, index) => (
        <button
          key={index}
          className={selected === index ? "selected" : ""}
          onClick={() => onSelect(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export const PopupForGet = ({order,setOrder,category,setCategory,curriculum,setCurriculum}) => {
  const orderOptions = ["作成が新しい順", "作成が古い順", "更新が新しい順", "更新が古い順"];
  const categoryOptions = ["すべて", "技術ブログ", "技術書", "技術系動画"];
  // const curriculumOptions = Array.from({ length: 28 }, (_, i) => `Curriculum ${i}`);
  const curriculumOptions = ["すべて","その他","エディタ(IDE)","OSコマンド(とシェル)","Git","Github","HTML&CSS","JavaScript","React","React x TypeScript","SQL","Docker","Go","HTTP Server(Go)","RDBMS(MySQL)への接続","Unit Test(Go)","フロントとバックの接続","CI","CD","認証","ハッカソン準準","ハッカソンの概要","インターン準備編","DB編","method & interfaceを学ぶ","ソースコードの改善","フロントにおける設計と状態管理","Vim"]

  const [orderPopup, setOrderPopup] = useState(false);
  const [categoryPopup, setCategoryPopup] = useState(false);
  const [curriculumPopup, setCurriculumPopup] = useState(false);

  const handleOrderSelect = (index) => {
    setOrder(index);
    setOrderPopup(false);
  };

  const handleCategorySelect = (index) => {
    setCategory(index);
    setCategoryPopup(false);
  };

  const handleCurriculumSelect = (index) => {
    setCurriculum(index);
    setCurriculumPopup(false);
  };

  return (
    <div className="popup-sort">
      <div>
        <button onClick={() => setOrderPopup(true)}>並べ替え: {orderOptions[order]}</button>
        {orderPopup && (
          <RadioPopup
            options={orderOptions}
            selected={order}
            onSelect={handleOrderSelect}
          />
        )}
      </div>
      <div>
        <button onClick={() => setCategoryPopup(true)}>カテゴリー: {categoryOptions[category]}</button>
        {categoryPopup && (
          <RadioPopup
            options={categoryOptions}
            selected={category}
            onSelect={handleCategorySelect}
          />
        )}
      </div>
      <div>
        <button onClick={() => setCurriculumPopup(true)}>カリキュラム: {curriculumOptions[curriculum]}</button>
        {curriculumPopup && (
          <RadioPopup
            options={curriculumOptions}
            selected={curriculum}
            onSelect={handleCurriculumSelect}
          />
        )}
      </div>
    </div>
  );
};

export default PopupForGet;
