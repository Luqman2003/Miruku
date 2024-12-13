import { useNavigate } from "react-router-dom";
import logo from "../../Assets/Error Milk.svg"

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    const handleRedirect = async (e: any) => {
        e.preventDefault();
        try {
            navigate("/");
        } catch (e: any) {
            console.log(e.message);
        }
    }

    return (
        <div className="formContainer">
            <form className="contentContainer" onSubmit={handleRedirect}>
                <div className="left">
                    <img src={logo} alt="Panic Milkbud" height={150} width={150}/>
                    <h3 className="header">404</h3>
                </div>
                <div className="divider"></div>
                <div className="right">
                    <div className="innerText">
                        <label>Page not found :(</label>
                    </div>
                    <button type="submit" className="authButton">Home</button>
                </div>
            </form>
        </div>
    )
};

export default ErrorPage;