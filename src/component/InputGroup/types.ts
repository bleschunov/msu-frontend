import { ChangeEvent, Dispatch, SetStateAction } from "react"

interface IInputGroup {
    setTable: Dispatch<SetStateAction<string>>
    isLoading: boolean
    errorMessage: string | undefined
    openSourcesHistory: () => void
}

interface IInputGroupContext {
    handleSubmit: (query: string, limit: number) => void
    similarQueries: string[]
}

interface IAdvancedSettings {
    handleIgnoreNullButtonClick: () => void
    limit: number
    handleLimitChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export type {
    IInputGroup,
    IInputGroupContext,
    IAdvancedSettings
}