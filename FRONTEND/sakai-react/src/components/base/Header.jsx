import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import AuthService from "../../services/AuthService";
import {useLocation, useNavigate} from "react-router";
import EventBus from "../../common/EventBus";


export default function Header() {
    const [currentUser, setCurrentUser] = useState("user");
    const navigation = useNavigate();
    const location = useLocation();
    //const dispatch = useDispatch();
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        /*
           EventBus.on("logout", () => {
             logOut();
           });
       */
        return () => {
            EventBus.remove("logout");
        };

    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        setCurrentUser();
        navigation("/login");
    };
    return(
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                {currentUser ? (
                    <Link to={"/home"} className="navbar-brand">
                        Fiberhome
                    </Link>
                ): (
                    <Link to={"/login"} className="navbar-brand">
                        Fiberhome
                    </Link>
                )}
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/home"} className="nav-link">
                            Home
                        </Link>
                    </li>
                </div>
                {currentUser ? (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/profile"} className="nav-link">
                                {currentUser.username}
                            </Link>
                        </li>
                        <li className="nav-item">
                            {location.pathname !== "/login" && (
                                <a onClick={logout} className="nav-link">
                                    Logout
                                </a>
                            )}
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>
                    </div>
                )}
            </nav>
    )
}