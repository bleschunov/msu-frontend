import { getOrCreateChat } from "api/chatApi"
import { INITIAL_MESSAGE_COUNT } from "constant/chatMessages"
import { useSearchQuery } from "misc/util"
import ChatModel from "model/ChatModel"
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react"
import { useQuery } from "react-query"
import { FF_CHAT_PDF } from "types/FeatureFlags"
import { UserContext } from "context/userContext"

type ModeT = "datastep" | "pdf"

interface ModeContextI {
    mode: ModeT
    setMode: Dispatch<SetStateAction<ModeT>>
    shownMessageCount: number
    setShownMessageCount: Dispatch<SetStateAction<number>>
    chatID: number | undefined
    isFilesEnabled: boolean
}

const ModeContext = createContext<ModeContextI>({} as ModeContextI)

interface ModeContextProviderProps {
    children: ReactNode
}

const ModeContextProvider: FC<ModeContextProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ModeT>("datastep")
    const [shownMessageCount, setShownMessageCount] = useState<number>(INITIAL_MESSAGE_COUNT)
    const user = useContext(UserContext)
    const { data: chat } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })
    const chatID = chat?.id

    const searchQuery = useSearchQuery()
    const isFilesEnabled = String(searchQuery.get(FF_CHAT_PDF)).toLowerCase() === "true"

    return (
        <ModeContext.Provider
            value={{
                mode,
                setMode,
                shownMessageCount,
                setShownMessageCount,
                chatID,
                isFilesEnabled
            }}
        >
            {children}
        </ModeContext.Provider>
    )
}

export {
    ModeContext, ModeContextProvider
}

export type {
    ModeContextI,
    ModeT
}

