import axiosClient from "api/axiosClient"
import PromptModel from "model/PromptModel"

const getPrompt = (): Promise<PromptModel> => {
    return axiosClient.get("/prompt").then(response => response.data)
}

const editPrompt = (body: Omit<PromptModel, "created_at">): Promise<PromptModel> => {
    return axiosClient.put("/prompt", body).then(response => response.data)
}

export {
    getPrompt,
    editPrompt
}