import api from "../../components/base/axios";
const BASE_URL = "/system/account";

const getWidgetPermission = (data) => {
    return api.post(BASE_URL+"/getWidgetPermission", data);
}

const AccountService = {
    getWidgetPermission
};
export default AccountService;
