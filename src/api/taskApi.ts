import axiosClient from "api/axiosClient"
import { FileUploadTaskModel } from "model/FileUploadTaskModel"

const getActiveFileUploadTasks = async (): Promise<FileUploadTaskModel[]> => {
    return []
    // const { data: fileUploadTasks } = await axiosClient.get("/task/file_upload/active")
    // return fileUploadTasks
}

const interruptTaskById = async (taskId: number): Promise<FileUploadTaskModel[]> => {
    const { data: fileUploadTasks } = await axiosClient.delete(`/task/file_upload/${taskId}`)
    return fileUploadTasks
}

export {
    getActiveFileUploadTasks,
    interruptTaskById
}