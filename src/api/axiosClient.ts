import axios, {AxiosInstance} from "axios";
import {getBaseUrl} from "../misc/util";

const axiosClient: AxiosInstance = axios.create({
    baseURL: getBaseUrl()
});

axiosClient.interceptors.response.use(response => response, exception => {
    console.log(exception)
})

export default axiosClient