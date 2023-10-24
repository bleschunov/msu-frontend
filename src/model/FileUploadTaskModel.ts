interface FileUploadTaskModel {
    id: number
    progress: number | null
    full_work: number | null
    status: string
}

export type {
    FileUploadTaskModel
}