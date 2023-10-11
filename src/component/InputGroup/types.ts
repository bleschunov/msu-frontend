import { Dispatch, SetStateAction } from 'react'

interface IInputGroup {
    setTable: Dispatch<SetStateAction<string>>
    isLoading: boolean
    isSourcesExist: boolean
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