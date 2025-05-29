/**
 * App.jsx
 *
 * This component serves as the root of the React application. It manages user authentication,
 * routing, and the conditional rendering of components based on the user's login status.
 */

import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IsLoggedIn} from "./api/authentication.js";
import Login from "./Login/Login.jsx";
import Header from "./Header/header.jsx";
import CaseList from "./CaseList/CaseList.jsx";
import CreateCase from "./CreateCase/CreateCase.jsx";
import ProfilePage from "./ProfilePage/ProfilePage.jsx";
import Message from "./Message/Message.jsx";
import {CaseProvider} from "./SelectedCase.jsx";

/**
 * App Component
 *
 * Handles user authentication status, manages routing, and conditionally renders components
 * based on whether the user is logged in.
 *
 */
function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const location = useLocation(); // Detect route changes
    const navigate = useNavigate(); // To redirect user when invalid

    /**
     * Effect hook to validate user authentication status whenever the route changes.
     */
    useEffect(() => {
        /**
         * Validates the user's login status.
         *
         * Revalidates the user's authentication state and redirects to the login page if the user
         * becomes invalid (i.e., not logged in).
         *
         * @async
         * @function validateUserOnNavigation
         */
        const validateUserOnNavigation = async () => {
            setLoading(true);

            try {
                const loggedIn = await IsLoggedIn();
                if (loggedIn !== isLoggedIn) {
                    setIsLoggedIn(loggedIn);

                    // Redirect to login if the user becomes invalid
                    if (!loggedIn) {
                        navigate("/Login");
                    }
                }
            } catch (error) {
                console.error("Error validating user:", error);
                setIsLoggedIn(false);
                navigate("/Login");
            } finally {
                setLoading(false);
            }
        };

        validateUserOnNavigation();
    }, [location, navigate]); // Runs whenever the route (`location`) changes

    /**
     * Renders an empty fragment while loading authentication status.
     */
    if (loading) return <></>;

    return (
        <CaseProvider>
            {isLoggedIn ? (
                <>
                    {/* Render Header and the main routes if the user is logged in */}
                    <Header/>
                    <Routes>
                        {/* Navigate To default if going to Login while already logged in */}
                        <Route path="/Login" element={<Navigate to="/"/>}/>
                        <Route
                            path="/"
                            element={
                                <>
                                    <CaseList/>
                                    <Message/>
                                </>
                            }
                        />
                        <Route path="/CreateCase" element={<CreateCase/>}/>
                        <Route path="/ProfilePage" element={<ProfilePage/>}/>
                        <Route path="/Login" element={<Login/>}/>
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
        </CaseProvider>
    );
}

export default App;