import axiosClient from "api/axiosClient"
import { UserModel } from "model/UserModel"

const create_tenant_with_user_id = async (user_id: string, email: string): Promise<UserModel> => {
    return axiosClient.post("/tenant", { user_id, email })
}

export {
    create_tenant_with_user_id
}
