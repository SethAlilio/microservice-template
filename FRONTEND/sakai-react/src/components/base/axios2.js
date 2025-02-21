import axios from 'axios';
import authHeader2 from "../../service/AuthHeader2";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import {useAuthState, useAuthStore, useAuthToken} from "../../stores/AuthStore";
const baseURL = 'http://localhost:8081';
const prodURL = window.location.protocol.concat("//").concat(window.location.hostname).concat(":8081");//'http://localhost:8081';

//TODO:: Multiple environment configurations .env & package.json

//NOTE: Use this to call APIs on flow-service
export const customAxios = axios.create({
    baseURL: prodURL,
    headers: authHeader2(), //rebind header every axios request
    withCredentials: true //to accept and pass cookies
});
/*customAxios.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        const isUserLoggedIn = useAuthState();
        const accessToken = useAuthToken();
        if (isUserLoggedIn) {
            config.headers["Authorization"] = accessToken;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
);*/
const AxiosInterceptor = ({ children }) => {
    const navigate = useNavigate();
    const isUserLoggedIn = useAuthState();
    const accessToken = useAuthToken();
    useEffect(() => {
        const resInterceptor = (response) => {
            return response;
        };

        const errInterceptor = (error) => {
            if (error?.response?.status === 401 && error?.response?.data !== "INVALID_CREDENTIALS") {
                toast.error(`Login Token expired. Kindly relogin again`, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                });
                //Move to global state or redis/database session id
                localStorage.removeItem("user");
                navigate("/login");
            }
            return Promise.reject(error.response);
        };

        const interceptor = customAxios.interceptors.response.use(
            resInterceptor,
            errInterceptor
        );


        return () => customAxios.interceptors.response.eject(interceptor);
    }, []);
    return children;
}
export default customAxios;
export {AxiosInterceptor};
