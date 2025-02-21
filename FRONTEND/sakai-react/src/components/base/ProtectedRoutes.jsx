import React, {useEffect} from "react"

import {Navigate, Outlet} from "react-router-dom"
import AuthService from "../../service/AuthService";
import { useCookies } from 'react-cookie';
import {useAuthState, useAuthStateRoles, useSetUserLoggedIn} from "../../stores/AuthStore";


const useAuth = () => {
    //get item from localstorage
    //const _user = AuthService.getCurrentUser();

    let isUserLoggedIn = useAuthState();
    const _userRoles = useAuthStateRoles();
    const changeAuthState = useSetUserLoggedIn();
    const [cookies] = useCookies(['logged_in']);
    const loggedIn = document.cookie.replace(/(?:(?:^|.*;\s*)logged_in\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    const temporaryAuthState = JSON.parse(sessionStorage.getItem("auth")).state.token;
    /*useEffect(() => {
        if (!loggedIn)
            changeAuthState(2);
        else
            isUserLoggedIn = true;
    })*/
    if (loggedIn) isUserLoggedIn = true;
    //else  changeAuthState(2);
    if (isUserLoggedIn || temporaryAuthState) {
        return {
            auth: true,
            role: _userRoles,
        }
    } else {
        return {
            auth: false,
            role: null,
        }
    }
};

//protected Route state
type ProtectedRouteType = {
    //roleRequired?: "ADMIN" | "USER"
    roleRequired: "ROLE_SUPER ADMINISTRATOR" | "TECHNICIAN"
}

const ProtectedRoutes = (props: ProtectedRouteType) => {
    const {auth, role} = useAuth();

   // console.log("ProtectedRouteType");
    //console.log(auth);

    //if the role required is there or not
    if (props.roleRequired) {
        return auth ? (
            props.roleRequired === role[0] ? (<Outlet /> ) : ( <Navigate to="/denied" /> )
        ) :
            ( <Navigate to="/login" />  )
    } else {
        return auth ? <Outlet /> : <Navigate to="/login" />
    }
};

export default ProtectedRoutes;
