import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Logo from "../../Assets/Logo.svg"

interface NavBarProps {
    loggedIn: boolean,
    setLoggedIn: (value: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({loggedIn, setLoggedIn}) => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setLoggedIn(false);
            localStorage.removeItem("isLoggedIn")
            localStorage.removeItem("username");
            navigate("/");
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    const fetchUsername = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, "Users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const fetchedUsername = userSnap.data().username;
                setUsername(fetchedUsername);
                localStorage.setItem("username", fetchedUsername);
            } else {
                console.log("No user data found!");
            }
        }
    };

    useEffect(() => {
        if (loggedIn) {
            fetchUsername();
        }
    });

    const routeSignIn = () => {
        navigate("/login");
    }

    const routeRegister = () => {
        navigate("/register");
    }

    const routeHome = () => {
        navigate("/");
    }

    const routeBrowse = () => {
        navigate("/browse");
    }

    const routeProfile = () => {
        if (auth.currentUser) {
            navigate(`/profile/${auth.currentUser.uid}`);
        }
    }

    return (
        <div className="navbar">
            <div className="logo-and-buttons">
                <img className="logo" src={Logo} alt="logo" onClick={routeHome}/>
                <button className="black-nav-button nav-buttons" onClick={routeBrowse}>Browse</button>
                {loggedIn && (
                    <button className="black-nav-button nav-buttons" onClick={routeProfile}>Profile</button>
                )}
            </div>
            {loggedIn ? (
                <div className="signOut">
                    <button className="black-nav-button nav-buttons" onClick={handleSignOut}>Sign Out</button>
                    <button className="nav-buttons primary-nav-button">{localStorage.getItem("username")}</button>
                </div>
            ) : (
                <div className="user-auth">
                    <button className="black-nav-button nav-buttons" onClick={routeSignIn}>Login</button>
                    <button className="primary-nav-button nav-buttons" onClick={routeRegister}>Sign up</button>
                </div>
            )}
        </div>
    );
}

export default NavBar;
