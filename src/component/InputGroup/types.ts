import { Dispatch, SetStateAction } from "react"

interface IInputGroup {
    setTable: Dispatch<SetStateAction<string>>
    isLoading: boolean
    errorMessage: string | undefined
    openSourcesHistory: () => void
    currentFileIndex: number
}

interface IInputGroupContext {
    handleSubmit: (query: string, limit: number) => void
    similarQueries: string[]
}

export type {
    IInputGroup,
    IInputGroupContext,
}