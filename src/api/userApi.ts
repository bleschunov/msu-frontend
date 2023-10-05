import axiosClient from "api/axiosClient"
import { UserModel } from "model/UserModel"

const getCurrentUser = (): Promise<UserModel> => {
    return axiosClient.get("/user/current").then(response => response.data)
}

export {
    getCurrentUser
}