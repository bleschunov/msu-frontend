import { FAVORITE_LIST } from "constant/favoriteList"
import { useSearchQuery } from "misc/util"
import { Dispatch, FC, ReactNode, SetStateAction, createContext, useState } from "react"

interface IFavoriteMessageContext {
    selectedFavoriteQuery: string
    setSelectedFavoriteQuery: Dispatch<SetStateAction<string>>
    isFavoriteListEnabled: boolean
}

const FavoriteMessageContext = createContext<IFavoriteMessageContext>({} as IFavoriteMessageContext)

interface FavoriteMessageContextProviderProps {
    children: ReactNode
}

const FavoriteMessageContextProvider: FC<FavoriteMessageContextProviderProps> = ({ children }) => {
    const [selectedFavoriteQuery, setSelectedFavoriteQuery] = useState<string>("")
    const query = useSearchQuery()
    const isFavoriteListEnabled = String(query.get(FAVORITE_LIST)).toLowerCase() === "true"

    return (
        <FavoriteMessageContext.Provider
            value={{
                selectedFavoriteQuery,
                setSelectedFavoriteQuery,
                isFavoriteListEnabled
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
