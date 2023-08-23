import axios, { AxiosInstance } from "axios"
import { supabase } from "./supabase"
import { getBaseUrl } from "../misc/util"

const axiosClient: AxiosInstance = axios.create({
    baseURL: getBaseUrl()
})

axiosClient.interceptors.request.use(async config => {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.access_token) {
        config.headers["Authorization"] = `Bearer ${session.access_token}`
    }

    return config
})

axiosClient.interceptors.response.use(response => response, e => {
    throw e
})

export default axiosClient