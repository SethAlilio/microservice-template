import '../assets/css/loginStyle.css';
import React, { useRef, useState} from "react";

import AuthService from "../service/AuthService";
import {useNavigate} from 'react-router-dom';
import {Field, Form} from "react-final-form";
import {classNames} from "primereact/utils";
import {InputText} from "primereact/inputtext";
import {useAuthState, useSetAuth} from "../stores/AuthStore";
import {setOrgTree, useSetOrgTree, SetLedgerOrgTree, SetLedgerAreaOrgTree, SetOrgGrade1, SetOrgGrade2, SetOrgGrade3, SetOrgGrade4} from "../stores/OrganizationStore";

import { setUserDetails }from "../stores/userStore"

const h2Style = {

    "marginBottom": "5px",
    "textAlign": "center",
    "textShadow": "0 4px 16px #fff",
    "fontSize": "30px",
    "fontWeight": "100"

}

const fieldsetStyle = {
    "margin": "0",
    "backgroundColor": "#fff",
    "border": "none",
    "borderRadius": "5px",
    "boxShadow": "0 1px 3px rgba(0,0,0,0.2)",
}

const legendStyle = {
    "padding": "5px",
    "backgroundColor": "#fff",
    "borderRadius": "5px"
}

const ulStyle = {
    "margin": "0",
    "padding": "0",
    "listStyleType": "none",
}

const liStyle = {
    "display": "grid",
    "alignItems": "center",
    "margin": "10px"
}

const lableStyle = {
    "textAlign": "left",
    "paddingBottom": "2px"
}

const inputStyle = {
    "width": "100%",
    "padding": "5px",
    "border": "1px solid #ddd",
    "borderRadius": "5px",
    "&:hover": {
        "border": "1px solid #aaf"
    }
}

const buttonStyle = {
    "padding": "10px",
    "border": "1px solid rgba(0,0,0,0)",
    "borderRadius": "5px",
    "background": "#fff",
    "boxShadow": "0 1px 3px rgba(0,0,0,0.2)",
    "&:hover": {
        "backgroundColor": "#eef",
        "border": "1px solid #aaf"
    }
}

const formStyle = {
    "gridColumn": "2",
    "gridRow": "2",
    "display": "grid",
    "gridGap": "10px",
    "margin": "auto 0",
    "padding": "35px",
    "backgroundColor": "rgba(255,255,255,0.9)",
    "borderRadius": "10px",
    "boxShadow": "0 32px 64px rgba(0,0,0,0.2)",
};

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const form = useRef();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    //const from = window.location.pathname || "/";
    //const auth = useAuthState();
    const setAuth = useSetAuth();
    const setOrganizationTree = useSetOrgTree();
    const setOrgLedgerTree = SetLedgerOrgTree();
    const setOrgLedgerAreaTree = SetLedgerAreaOrgTree();
    const setUserDetailsProx = setUserDetails();


    const setOrgGrade1 = SetOrgGrade1();
    const setOrgGrade2 = SetOrgGrade2();
    const setOrgGrade3 = SetOrgGrade3();
    const setOrgGrade4 = SetOrgGrade4();

    const handleLogin = async (e) => {
        setMessage("");
        setLoading(true);
       const response =  await AuthService.login(e.username, e.password);
       if (response?.status === 200){
           //console.log(response);
           const accessToken = response.data?.id;
           const username = response.data?.username;
           setAuth({token: accessToken, username: username,roles:response.data?.roles, userOrg:response.data?.assignedOrganizationId});
           setOrganizationTree(response.data?.organizationTree);

           //setOrgLedgerTree([{label:"FG",key:"10"}, {label:"GLOBE",key:"12"}]);
           setOrgLedgerTree(response.data?.organizationLedgerTree);

           setOrgLedgerAreaTree(response.data?.organizationLedgerAreaTree);

           setOrgGrade1(response.data?.organizationGrade1);

           setOrgGrade2(response.data?.organizationGrade2);

           setOrgGrade3(response.data?.organizationGrade3);

           setOrgGrade4(response.data?.organizationGrade4);

           setUserDetailsProx(response.data?.userDetailsLog);
           //localStorage.setItem("user", JSON.stringify(response.data));
           AuthService.setupAxiosInterceptors(AuthService.createJWTToken(accessToken));
           navigate("/", {replace: true});
       }else{
           if (response?.status === 500){
               setMessage('No Server Response');
           } else if (response?.status === 503) {
               setMessage('Login service not available');
           } else if (response?.status === 400) {
               setMessage('Missing username or password');
           } else if (response?.status === 401) {
               setMessage('Invalid Credentials');
           } else {
               setMessage('Login failed');
           }
           setLoading(false);
       }
    };

    const validate = (data) => {
        let errors = {};

        if (!data.username) {
            errors.username = 'Username is required.';
        }
        if (!data.password) {
            errors.password = 'Password is required.';
        }
        return errors;
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error && meta.visited);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error"><h3>{meta.error}</h3></small>;
    };
// eslint-disable-next-line
    return (
        <section id="entry-page">
            <Form onSubmit={handleLogin} validate={validate}
                  render={({handleSubmit}) => (
              <form onSubmit={handleSubmit} style={formStyle} className="p-fluid">
                <h2 style={h2Style}>MICROSERVICE TEMPLATE</h2>
              <fieldset style={fieldsetStyle}>
                    <legend style={legendStyle}>Log In</legend>
                  <ul style={ulStyle}>
                        <li style={liStyle}>
                            <Field name="username" render={({input, meta}) => (
                                <>
                                <label htmlFor="username" style={lableStyle} className={classNames({ 'p-error': isFormFieldValid(meta) })}>Username:</label>
                                <InputText
                                    type="text"
                                    id="username"
                                    {...input}
                                    name="username"
                                    autoComplete="username"
                                    style={inputStyle}
                                    className={classNames({'p-invalid': isFormFieldValid(meta)})}
                                />
                                {getFormErrorMessage(meta)}
                                </>
                            )}/>
                      </li>
                        <li style={liStyle}>
                            <Field name="password" render={({input, meta}) => (
                                <>
                                <label htmlFor="password" style={lableStyle} className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password:</label>
                                <InputText
                                    type="password"
                                    name="password"
                                    id="password"
                                    {...input}
                                    autoComplete="current-password"
                                    style={inputStyle}
                                    className={classNames({'p-invalid': isFormFieldValid(meta)})}
                                />
                                    {getFormErrorMessage(meta)}
                                </>
                            )}/>
                       </li>
                        <li style={liStyle}>
                            <i/>
                        </li>
                    </ul>
                </fieldset>
                <button style={buttonStyle} disabled={loading}>Login</button>

                <div>
                    {message && (
                        <div className="form-group">
                            <div style={{backgroundColor: "#fdc0b4", padding: '15px'}}>
                                {message}
                            </div>
                        </div>
                    )}
                    {loading && (
                        "Connecting..."
                    )}
                </div>
            </form>
        )}/>
        </section>
    );

};

export default Login;
