import axiosClient from "api/axiosClient"
import SourceModel from "model/SourceModel"

const getAllSources = (chatId: number): Promise<SourceModel[]> => {
    return axiosClient.get(`/source/${chatId}`).then(response => response.data)
}

const getLastSource = (chatId: number): Promise<SourceModel> => {
    return axiosClient.get(`/source/last/${chatId}`).then(response => response.data)
}

const uploadSource = (body: Omit<SourceModel, "id" | "source_id" | "file_name" | "created_at">): Promise<SourceModel> => {
    return axiosClient.postForm(
        `/source/${body.chat_id}`,
        { fileObject: body.file },
        {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }
    ).then(response => response.data)
}

export {
    getAllSources, getLastSource, uploadSource
}

