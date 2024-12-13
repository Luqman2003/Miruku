import { useState } from "react";
import { auth, db } from "../../Firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import logo from "../../Assets/MilkBud.svg";

interface UserDocument {
  email: string;
  username: string;
}

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user && user.email) {
        const userDoc: UserDocument = {
          email: user.email,
          username: username,
        };
        await setDoc(doc(db, "Users", user.uid), userDoc);
        navigate("/login");
      }
    } catch (e: any) {
      console.error(e.message);
      navigate("/404");
    }
  };

  return (
    <div className="formContainer">
      <form className="contentContainer" onSubmit={handleRegister}>
        <div className="left">
          <img src={logo} alt="Happy Milkbud" height={150} width={150} />
          <h3 className="header">Sign Up</h3>
        </div>
        <div className="divider"></div>
        <div className="right">
          <div className="innerText">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <button type="submit" className="authButton">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
