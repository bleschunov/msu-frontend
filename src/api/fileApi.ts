import axiosClient from "api/axiosClient"
import FileModel from "model/FileModel"

const getAllFiles = (chat_id: number): Promise<FileModel[]> => {
    return axiosClient.get(`/file/${chat_id}`).then(response => response.data)
}

const uploadFile = (body: Omit<FileModel, "id" | "name_ru" | "name_en" | "url">): Promise<FileModel> => {
    return axiosClient.postForm(
        `/file/${body.chat_id}`,
        { fileObject: body.file },
        {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }
    ).then(response => response.data)
}

const removeFile = (body: Omit<FileModel, "file">) => {
    return axiosClient.delete("/file/", {
        data: body
    })
}

export {
    getAllFiles,
    uploadFile,
    removeFile
}
