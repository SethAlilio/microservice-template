import React, {Component} from 'react'
import { Route, Navigate  } from 'react-router-dom'
import AuthService from "../../services/AuthService";
import Home from "../Home";

const AuthenticatedRoute = (element: Component, loggedIn, path, ...rest) => {
   return (
    <Route
        path={path}
        {...rest}
        render={
        props => {
            if(AuthService.isUserLoggedIn()) {
                return <Component {...props}/>;
            } else {
                return <Navigate  to="/"/>
            }
        }
    } />
   )
};
export default AuthenticatedRoute;