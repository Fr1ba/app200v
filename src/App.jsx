import {BrowserRouter as Router, Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IsLoggedIn} from "./UserValidation.jsx"
import Login from './Login/Login.jsx/';
import Header from "./Header/header.jsx";
import CaseList from "./CaseList/CaseList.jsx";
import CreateCase from "./CreateCase/CreateCase.jsx";
import ProfilePage from "./ProfilePage/ProfilePage.jsx";
import APITest from "./APITest.jsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Detect route changes
    const navigate = useNavigate(); // To redirect user when invalid

    // Revalidate when the route changes
    useEffect(() => {
        const validateUserOnNavigation = async () => {
            setLoading(true);

            const loggedIn = await IsLoggedIn();
            if (loggedIn !== isLoggedIn) {
                setIsLoggedIn(loggedIn);

                // Redirect to login if the user becomes invalid
                if (!loggedIn) {
                    navigate("/Login");
                }
            }

            setLoading(false);
        };

        validateUserOnNavigation();
    }, [location, navigate]); // Runs whenever the route (`location`) changes


    if(loading) return (
        <></>
    )

    return (
        <>
            {isLoggedIn ? (
                <>
                    {/* Render Header and the main routes if the user is logged in */}
                    <Header/>
                    <Routes>
                        {/* Navigate To default if going to Login while already logged in */}
                        <Route path="/Login" element={<Navigate to="/"/>}/>
                        <Route path="/" element={<CaseList/>}/>
                        <Route path="/CreateCase" element={<CreateCase/>}/>
                        <Route path="/ProfilePage" element={<ProfilePage/>}/>
                        <Route path="/APITest" element={<APITest/>}/>
                    </Routes>
                </>
            ) : (
                // Show only the Login page if not logged in
                <Routes>
                    <Route path="/Login" element={<Login/>}/>
                    <Route
                        path="*"
                        element={<Login/>} // Redirect all invalid routes to Login
                    />
                </Routes>
            )}
        </>
    );
}

export default App;

