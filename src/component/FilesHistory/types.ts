import FileModel from '../../model/FileModel'

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

interface IFileRowContext {

}

export type {
    IDeleteFileModal,
    IFileRow,
    IFileRowContext
}