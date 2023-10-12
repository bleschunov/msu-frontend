import axios, { AxiosError, AxiosInstance } from "axios"
import { signOut, supabase } from "api/supabase"
import { getBaseUrl } from "misc/util"

const axiosClient: AxiosInstance = axios.create({
    baseURL: getBaseUrl()
})

axiosClient.interceptors.request.use(
    async config => {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
            config.headers["Authorization"] = `Bearer ${session.access_token}`
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