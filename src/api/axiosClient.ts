import axios, { AxiosError, AxiosInstance } from "axios"
import { signOut, supabase } from "./supabase"
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

axiosClient.interceptors.response.use(response => response, (e: AxiosError) => {
    if (e.response?.status === 401) {
        signOut()
        return
    }

    throw e
})

export default axiosClient