import { getOrCreateChat } from "api/chatApi"
import { INITIAL_MESSAGE_COUNT } from "constant/chatMessages"
import ChatModel from "model/ChatModel"
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react"
import { useQuery } from "react-query"
import { UserContext } from "context/userContext"
import { ModeT } from "model/UserModel"

interface ModeContextI {
    currentMode: ModeT
    setMode: Dispatch<SetStateAction<ModeT>>
    shownMessageCount: number
    setShownMessageCount: Dispatch<SetStateAction<number>>
    chatID: number | undefined
    isFilesEnabled: boolean
    isDatabaseEnabled: boolean
}

const ModeContext = createContext<ModeContextI>({} as ModeContextI)

interface ModeContextProviderProps {
    children: ReactNode
}

const ModeContextProvider: FC<ModeContextProviderProps> = ({ children }) => {
    const user = useContext(UserContext)

    const is_wiki_mode = user.tenants[0].modes.filter(m => m.name === "wiki").length > 0
    const is_databases_mode = user.tenants[0].modes.filter(m => m.name === "databases").length > 0
    const defaultMode = is_databases_mode ? "databases" : "wiki"

    const [mode, setMode] = useState<ModeT>(defaultMode)
    const [shownMessageCount, setShownMessageCount] = useState<number>(INITIAL_MESSAGE_COUNT)
    const { data: chat } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })
    const chatID = chat?.id

    const isFilesEnabled = is_wiki_mode
    const isDatabaseEnabled = is_databases_mode

    return (
        <ModeContext.Provider
            value={{
                currentMode: mode,
                setMode,
                shownMessageCount,
                setShownMessageCount,
                chatID,
                isFilesEnabled,
                isDatabaseEnabled
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

