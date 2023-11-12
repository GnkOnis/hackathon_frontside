import { SignUp } from "./SignUp.jsx";
import { SignIn } from "./SignIn.jsx";
import { useNavigate } from "react-router-dom";
import "./css/Top.css";

export function Top(){
    const navigate = useNavigate();
    return (
        <div className="container" style={{marginTop:'80px'}}>
            <h2 className="top_h2">UTTC Knowledgebase</h2>
            {/* <dir style={{marginTop:'80px'}}></dir> */}
            <p className="top_p">Thank you for visiting this site!</p>
            <p className="top_p">ログイン</p>
            <SignIn/>
            <button onClick={() => navigate("/signup")}>SignUpはこちらから</button>
        </div>
    )
}

export default Top;