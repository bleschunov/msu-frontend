import axiosClient from "api/axiosClient"
import { PromptModel, PromptEditModel } from "model/PromptModel"

const getActivePrompt = (tenant_id: number): Promise<PromptModel> => {
    return axiosClient.get(`/tenant/${tenant_id}/prompt/active`).then(response => response.data)
}

const editActivePrompt = (prompt_id: number, body: PromptEditModel): Promise<PromptModel> => {
    return axiosClient.put(`/prompt/${prompt_id}`, body).then(response => response.data)
}

export {
    getActivePrompt,
    editActivePrompt
}