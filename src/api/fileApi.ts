import axiosClient from "api/axiosClient"
import { FileModel, FileUploadModel } from 'model/FileModel'

const getAllFiles = (): Promise<FileModel[]> => {
    return axiosClient.get(`/file`).then(response => response.data)
}

const uploadFile = (body: FileUploadModel): Promise<FileModel> => {
    return axiosClient.postForm(
        `/file`,
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
