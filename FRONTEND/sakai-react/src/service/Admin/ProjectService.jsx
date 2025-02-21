import axios from "../../../components/base/axios";
const BASE_URL = "/projects";

const getAllProjectList = () => {
    return axios.get(BASE_URL+"/loadProjectList");
};

const getOrganizationList = () => {
    return axios.get(BASE_URL+"/loadOrganizationList");
};

const saveNewProject = (params) => {
    return axios.put(BASE_URL+"/addProjectListDetails",params);
};

const editProjectDetails = (params) => {
    return axios.put(BASE_URL+"/editProjectListDetails/"+params.id,params);
};

const deleteProject = (id) => {
    return axios.delete(BASE_URL+"/deleteProjectDetails/"+id);
};

const getAllRegions = () =>{
    return axios.get(BASE_URL+"/getAllRegions");
}

const ProjectService = {
    getAllProjectList,
    saveNewProject,
    editProjectDetails,
    deleteProject,
    getOrganizationList,
    getAllRegions
};
export default ProjectService;
