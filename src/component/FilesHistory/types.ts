import { FileModel } from "model/FileModel"
import { FileUploadTaskModel } from "model/FileUploadTaskModel"

interface IDeleteFileModal {
    handleDeleteFile: () => void
    isOpenModal: boolean
    onCloseModal: () => void
}

interface IFileRow {
    file: FileModel
    isSelected: boolean
    setThisFileIndex: () => void
}

interface IFileUploadingProgress {
    task: FileUploadTaskModel
}

export type {
    IDeleteFileModal,
    IFileRow,
    IFileUploadingProgress
}