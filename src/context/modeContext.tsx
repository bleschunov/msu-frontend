import queryClient from "api/queryClient"
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

const InitialMessageCount: number = 2

const ModeContextProvider: FC<ModeContextProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ModeT>("datastep")
    const [shownMessageCount, setShownMessageCount] = useState<number>(InitialMessageCount)
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
    InitialMessageCount, ModeContext, ModeContextProvider
}

export type {
    ModeContextI,
    ModeT
}
