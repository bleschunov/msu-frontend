import { Dispatch, FC, ReactNode, SetStateAction, createContext, useState } from "react"

interface IFavoriteMessageContext {
    selectedFavoriteQuery: string
    setSelectedFavoriteQuery: Dispatch<SetStateAction<string>>
}

const FavoriteMessageContext = createContext<IFavoriteMessageContext>({} as IFavoriteMessageContext)

interface FavoriteMessageContextProviderProps {
    children: ReactNode
}

const FavoriteMessageContextProvider: FC<FavoriteMessageContextProviderProps> = ({ children }) => {
    const [selectedFavoriteQuery, setSelectedFavoriteQuery] = useState<string>("")
    return (
        <FavoriteMessageContext.Provider
            value={{
                selectedFavoriteQuery,
                setSelectedFavoriteQuery
            }}
        >
            {children}
        </FavoriteMessageContext.Provider>
    )
}

export {
    FavoriteMessageContext, FavoriteMessageContextProvider
}

export type {
    IFavoriteMessageContext
}
