import React from "react";
import {Route, Routes} from "react-router";

import Login from "../../pages/Login";
import Home from "../../pages/Home";

import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";

const MainRoutes = (props) =>{
    return(
        <>
        <Routes>

        <Route path="/" element={<ProtectedRoutes roleRequired={"ROLE_SUPER ADMINISTRATOR" | "TECHNICIAN"} />}>
                <Route exact path="/" element={<Home/>} >
                    <Route path="/*" element={<Home/>} />
                </Route>
        </Route>

        <Route path="login" element={<PublicRoutes />}>
            <Route path="/login" element={<Login/>} />
        </Route>

        </Routes>
        </>
    );
}

export default MainRoutes;
