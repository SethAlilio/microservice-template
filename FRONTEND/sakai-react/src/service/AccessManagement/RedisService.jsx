import api from "../../../components/base/axios";
const BASE_URL = "/redis";

const getAllRedisKeys = () => {
    return api.get(BASE_URL + "/getKeys");
}
const getAllValuesByKey = (redisKey) => {
    return api.get(BASE_URL + "/getValue/"+redisKey);
}
const deleteRedisKey = (redisKey) => {
    return api.put(BASE_URL + "/deleteKey/"+redisKey);
}
const deleteValueOnKey = (redisKey,object) => {
    return api.post(BASE_URL + "/deleteValue/"+redisKey,{value:object});
}
const toggleNotificationReadState = (redisKey,object) => {
    return api.post(BASE_URL + "/toggleRead/"+redisKey,{value:object});
}
const RedisService = {
    getAllRedisKeys,
    getAllValuesByKey,
    deleteRedisKey,
    deleteValueOnKey,
    toggleNotificationReadState
}
export default RedisService;
