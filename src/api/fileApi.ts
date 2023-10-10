import axiosClient from './axiosClient'
import FileModel from '../model/FileModel'

const getAllFiles = (): Promise<FileModel[]> => {
    return axiosClient.get("/file").then(response => response.data)
}

export {
    getAllFiles
}