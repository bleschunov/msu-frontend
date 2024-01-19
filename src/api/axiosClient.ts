import axios, { AxiosError, AxiosInstance } from "axios"
import { signOut } from "api/supabase"
import { getBaseUrl } from "misc/util"
import Cookies from "universal-cookie"

const axiosClient: AxiosInstance = axios.create({
    baseURL: getBaseUrl()
})

axiosClient.interceptors.request.use(
    async config => {
        const cookies = new Cookies()
        const token = cookies.get("token")

        if (token) {
            config.headers["Authorization"] = `Bearer ${token.access_token}`
        }

        return config
    }
)

axiosClient.interceptors.response.use(response => response, async (error: AxiosError) => {
    if (error.response?.status === 401) {
        await signOut()
        return
    }

    throw error
})

export default axiosClient