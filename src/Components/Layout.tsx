import { Outlet } from 'react-router-dom';
import NavBar from "./NavBar/NavBar";

interface LayoutProps {
    loggedIn: boolean,
    setLoggedIn: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({loggedIn, setLoggedIn}) => {
    return (
        <div>
            <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Outlet /> {/* This renders the matched route's component */}
        </div>
    );
};

export default Layout;
