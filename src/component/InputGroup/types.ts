import { Dispatch, SetStateAction } from 'react'

interface IInputGroup {
    setTable: Dispatch<SetStateAction<string>>
    isLoading: boolean
    onUploadFiles: (files: FileList) => void
    multipleFilesEnabled?: boolean
    isSourcesExist: boolean
    isUploadingFile: boolean
    errorMessage: string | undefined
    openSourcesHistory: () => void
}

interface IInputGroupContext {
    handleSubmit: (query: string) => void
    similarQueries: string[]
}

export type {
    IInputGroup,
    IInputGroupContext
}