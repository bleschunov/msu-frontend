import axios, {AxiosInstance} from "axios";
import {getBaseUrl} from "../misc/util";

const axiosClient: AxiosInstance = axios.create({
    baseURL: getBaseUrl()
});

axiosClient.interceptors.response.use(response => response, e => {
    throw e
})

export default axiosClient