import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Pages/Home";
import SignIn from "./Components/UserAuth/SignIn";
import './App.css';
import Register from "./Components/UserAuth/Register";
import Layout from "./Components/Layout";
import DetailPage from "./Components/Pages/DetailPage";
import ErrorPage from './Components/Pages/ErrorPage';
import Profile from "./Components/Pages/Profile";
import Browse from './Components/Pages/Browse';
import AnimeList from './Components/Pages/AnimeList';


function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    
    useEffect(() => {
        const checkLoggedIn = localStorage.getItem("isLoggedIn");
        if (checkLoggedIn == "true") {
            setLoggedIn(true);
        }
    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout loggedIn={loggedIn} setLoggedIn={setLoggedIn} />,
            children: [
                {
                  path: "/",
                  element: <Home />,
                },
                {
                    path: "/login",
                    element: <SignIn setLoggedIn={setLoggedIn}/>,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
                {
                    path: "/anime/:title",
                    element: <DetailPage />
                },
                {
                    path: "/browse",
                    element: <Browse />
                },
                {
                    path: "/profile/:uid",
                    element: <Profile />,
                },
                {
                    path: "/animelist/:uid",
                    element: <AnimeList />,
                },
                {
                    path: "/404",
                    element: <ErrorPage />
                },
            ]
        },
    ]);


    return (
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}

export default App;
