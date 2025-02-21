import axios from "../../../components/base/axios";

const BASE_URL = "/fhuser";

const getAllFhUsers  = () => {
    return axios.get(BASE_URL+"/loadAllUsers");
};

const loadFhUserAccess = (fhId) => {
    return axios.get(BASE_URL+"/loadUserAccess/"+fhId);
};

const searchFhUsers = (searchKey) => {
    return axios.get(BASE_URL+"/searchUFhiduser/"+searchKey);
};

const updateUserDataDetails = (fhid,params) => {
    return axios.put(BASE_URL+"/updateUserData/"+fhid,params);
};

const saveNewFhUser = (params) => {
  return axios.put(BASE_URL+"/SaveUserInput",params);
};

const dumpFhUser = (fhId) => {
  return axios.delete(BASE_URL+"/dumpUser/"+fhId);
};

const loadUserProjects = () => {
    return axios.get(BASE_URL+"/loadUserProjectSelection");
};

const deleteUserAccess = (id) => {
    return axios.delete(BASE_URL+"/deleteUserAccess/"+id);
};
const insertUserAccess = (fhid,params) => {
    return axios.put(BASE_URL+"/insertUserAccess/"+fhid,params);
};
const updateUserAccess = (rolesId,params) => {
    return axios.put(BASE_URL+"/updateUserAccess/"+rolesId,params);
};

const FhUserService = {
    getAllFhUsers,
    loadFhUserAccess,
    searchFhUsers,
    updateUserDataDetails,
    saveNewFhUser,
    dumpFhUser,
    loadUserProjects,
    deleteUserAccess,
    insertUserAccess,
    updateUserAccess
};
export default FhUserService;
