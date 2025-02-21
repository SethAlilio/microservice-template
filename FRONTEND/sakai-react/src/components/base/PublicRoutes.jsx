import React from 'react';

import {Navigate, Outlet} from 'react-router-dom'
import AuthService from "../../service/AuthService";
import {useAuthState} from "../../stores/AuthStore";

//console.log("PublicRoutes");
const useAuth=()=>{
    const user= AuthService.getCurrentUser();
   // return !!user;
    //const isUserLoggedIn = !!useAuthState();
    //return !!isUserLoggedIn;
    const loggedIn = document.cookie.replace(/(?:(?:^|.*;\s*)logged_in\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    return loggedIn? !loggedIn: null;

};

//const  PublicRoutes=(props:any) =>{
const PublicRoutes=() =>{
    const auth= useAuth();
    //console.log('public cookie', auth);
    return auth? <Navigate to="/login"/>: <Outlet/>
};
export default PublicRoutes;
