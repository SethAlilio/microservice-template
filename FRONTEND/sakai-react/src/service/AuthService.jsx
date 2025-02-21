import axios from "../components/base/axios";
const login = async (username, password) => {
    try {
        const response = await axios.post("/auth/login", {
            username,
            password,
        }, { withCredentials: true });

        const { data } = response;
        if (data && data.userDetailsLog) {
            localStorage.setItem("user", JSON.stringify(data.userDetailsLog));
            console.log("User details after login:", data.userDetailsLog);
        }
        return response;

    } catch (error) {
        console.error("Login error:", error);
        return error;
    }
};

const createJWTToken = (token) =>{
    return 'Bearer ' + token
};
const logout   = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userDetailsLog");
    //localStorage.removeItem("token");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const getCurrentUserOrg = () => {
    return JSON.parse(localStorage.getItem("user")).organizationTree;
}

const getCurrentUserCompanyId = () => {
    const currentUser = getCurrentUser();
    return currentUser?.COMPANY_ID;
};

const isUserLoggedIn = () => {
    //let user = localStorage.getItem("user");
    let user = sessionStorage.getItem("auth");
    return user !== null;

};

const setupAxiosInterceptors = (token) => {
    axios.interceptors.request.use(
        (config) => {
            config.withCredentials = true;
            if (isUserLoggedIn()) {
                config.headers["Authorization"] = token;
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    );
    axios.defaults.withCredentials = true;
    axios.defaults.headers['Authorization'] = token;
};

const AuthService = {
    login,
    logout,
    createJWTToken,
    getCurrentUser,
    isUserLoggedIn,
    setupAxiosInterceptors,
    getCurrentUserOrg,
    getCurrentUserCompanyId
};
export default AuthService;
