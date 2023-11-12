import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { updateProfile,createUserWithEmailAndPassword} from "firebase/auth";   
import { fireAuth } from "./firebase.ts";

export function SignUp(){
    const [formData, setFormData] = useState({
        name: "",
        email:"",
        password:"",
    });
    const { name, email,password } = formData;
    const navigate = useNavigate();
    //ユーザーがテキスト入力を変更するたびに、各入力フィールドの値をフォームデータステートであるformDataに反映
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(
                fireAuth,
                email,
                password
            );
            updateProfile(fireAuth.currentUser, {
                displayName: name,
            });
            navigate("/main");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                type="text"
                placeholder="Name"
                id="name"
                value={name}
                required
                onChange={onChange}
                />
                <input
                type="email"
                placeholder="Email"
                id="email"
                value={email}
                required
                onChange={onChange}
                />
                <input
                type="password"
                placeholder="Password"
                id="password"
                value={password}
                required
                onChange={onChange}
                />
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default SignUp;
