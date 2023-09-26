import queryClient from "api/queryClient"
import { INITIAL_MESSAGE_COUNT } from "constant/chatMessages"
import { useSearchQuery } from "misc/util"
import ChatModel from "model/ChatModel"
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"
import { FF_CHAT_PDF } from "types/FeatureFlags"

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
    const chatID = queryClient.getQueryData<ChatModel>("chat")?.id

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
