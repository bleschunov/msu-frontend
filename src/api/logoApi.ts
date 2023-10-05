import axiosClient from "api/axiosClient"

export const getLogo = async (user_id:string): Promise<string> => {
    return axiosClient.get(`/logo/${user_id}`).then(response => response.data)
}