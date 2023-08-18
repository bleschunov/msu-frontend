import axios, {AxiosInstance} from "axios";
import {getBaseUrl} from "../misc/util";
import {supabase} from "./supabase";

const axiosClient: AxiosInstance = axios.create({
    baseURL: getBaseUrl()
});

axiosClient.interceptors.request.use(async config => {
    const { data: {session} } = await supabase.auth.getSession()

    if (session?.access_token) {
        config.headers["Authorization"] = `Bearer ${session.access_token}`
    }

    console.log(session)

    return config
})

axiosClient.interceptors.response.use(response => response, e => {
    throw e
})

export default axiosClient