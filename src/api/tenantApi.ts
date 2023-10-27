import axiosClient from "api/axiosClient"
import { UserModel } from "model/UserModel"

const create_tenant_with_user_id = async (userId: string): Promise<UserModel> => {
    return axiosClient.post(`/tenant/${userId}`)
}

export {
    create_tenant_with_user_id
}
