import axios from "../../../components/base/axios";
const BASE_URL = "/announcements";

const loadAllAnnouncements = (param) => {
    if(param){
        return axios.post(BASE_URL+"/get-announcements", {startDate: param.get("startDate"),endDate: param.get("endDate")});
    }else{
        return axios.post(BASE_URL+"/get-announcements", {param});
    }
};

const saveAnnouncement = (announcement) => {
    return axios.post(BASE_URL+"/post-announcement",announcement);
};

const deleteAnnouncement = (announcementId) => {
    return axios.delete(BASE_URL+"/delete-announcement/"+announcementId);
}
const dispatchNotifications = () => {
    return axios.post(BASE_URL+"/dispatch");
}

const getTaskNotifications = (userId) => {
    return axios.get(BASE_URL+"/getTaskNotifications?userId="+userId)
}

const AnnouncementService = {
    loadAllAnnouncements,
    saveAnnouncement,
    deleteAnnouncement,
    dispatchNotifications,
    getTaskNotifications
};
export default AnnouncementService;
