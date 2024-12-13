import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Firebase/firebase";
import logo from "../../Assets/MilkBud.svg"


interface SignInProps {
    setLoggedIn: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ setLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const isLogged = localStorage.getItem("isLoggedIn") === "true";
        setLoggedIn(isLogged);
        if (isLogged) navigate("/");
    }, [setLoggedIn, navigate]);

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/");
        } catch (error: any) {
            console.error(error.message);
            localStorage.removeItem("isLoggedIn");
            navigate("/404");
        }
    }

    return (
        <div className="formContainer">
            <form className="contentContainer" onSubmit={handleSignIn}>
                <div className="left">
                    <img src={logo} alt="Happy Milkbud" height={150} width={150}/>
                    <h3 className="header">Login</h3>
                </div>
                <div className="divider"></div>
                <div className="right">
                    <div className="innerText">
                        <label>Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="innerText">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="authButton">Login</button>
                </div>
            </form>
        </div>
    )
};

export default SignIn;