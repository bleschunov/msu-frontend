interface FileModel {
    id: number
    tenant_id: number
    original_filename: string
    storage_filename: string
    file_path: string
}

interface FileUploadModel {
    file: File
}

export type {
    FileModel,
    FileUploadModel
}