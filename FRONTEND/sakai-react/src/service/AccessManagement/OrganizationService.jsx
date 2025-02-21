import api from "../../components/base/axios";
import axios from "axios";
const BASE_URL = "/system/menu";

const saveNewOrganization = (newOrg) =>{
  return api.post(BASE_URL + "/saveNewOrg",{object:newOrg});
}

const updateOrganization = (updatedOrg) => {
    return api.post(BASE_URL + "/updateOrg",{object: updatedOrg});
}

const OrganizationService = {
    saveNewOrganization,
    updateOrganization
};
export default OrganizationService;
