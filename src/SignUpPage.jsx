import { useNavigate } from "react-router-dom";
import { SignUp } from "./SignUp.jsx";

export function SignUpPage(){
    const navigate = useNavigate();
    const handleGoBack = () => {
        // '/main'から'/に戻る'に遷移
        navigate("/");
      };
    return(
        <div>
            <p>サインアップ</p>
            <SignUp/>
            <button onClick={handleGoBack}>ログイン画面に戻る</button>
        </div>
    )
}

export default SignUpPage