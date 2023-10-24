interface FileUploadTaskModel {
    id: number
    progress: number
    full_work: number
    status: "active" | "interrupted" | "finished"
    file_id: number
    created_at: string
}

export type {
    FileUploadTaskModel
}