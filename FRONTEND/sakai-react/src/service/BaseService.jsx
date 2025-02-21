import axios from "../components/base/axios";
import AuthService from "../service/AuthService";
//import authHeader from "./AuthHeader";
const API_URL = window.location.protocol.concat("//").concat(window.location.hostname).concat(":8090");

const HttpGet = (path) => {
    const res = axios.get(path);
    return res;
};

const HttpGet002 = (host, path) => {
    return axios.get(host + path);
};

const HttpGetBlob = (path) => {
    return axios.get(path, {responseType: 'blob'});
};

const getAuth = () => {
    //const user = AuthService.getCurrentUser();
    //axios.defaults.headers['Authorization'] = 'Bearer '+ user.id;
};

const HttpPost = (path, params) => {
    const res = axios.post (path, params,

        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return res;
};

const HttpPostWithBlob = (path, params) => {
    const res = axios.post (path, params,

        {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'blob'
        }
    );
    return res;
};

const HttpPostForm = (path, params) => {
    const res = axios.post (path, params,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
    return res;
};

const HttpUploadFileToUrl = (fileFormData, path) => {

    var res = axios.post(API_URL + path, fileFormData

        );
    return res;
};

const downloadTemplate = (path) => {
    return axios({
        url:  path,
        method: 'GET',
        responseType: 'blob',
    });
}

 const staticUrl = (path) =>{
    return API_URL + path;
 }

// benkuramax added

//let toks = localStorage.getItem('token');
/*const user = AuthService.getCurrentUser();
debugger;
if(user !== null){

    console.log(user.id);
    axios.interceptors.request.use((config) => {
        //console.log('axios.interceptors.request');
        config.headers['Authorization'] = user.id;
        return config;
    }, (error) => {
        console.log(JSON.stringify(error));
        return Promise.reject(error);
    });
} */


const BaseService = {
    HttpGet,
    HttpPost,
    HttpPostForm,
    HttpGet002,
    HttpGetBlob,
    HttpUploadFileToUrl,
    downloadTemplate,
    staticUrl,
    HttpPostWithBlob
};
export default BaseService;
