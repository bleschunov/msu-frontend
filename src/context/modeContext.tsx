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
    const defaultMode = user.available_modes.includes("databases") ? "databases" : "wiki"
    const [mode, setMode] = useState<ModeT>(defaultMode)
    const [shownMessageCount, setShownMessageCount] = useState<number>(INITIAL_MESSAGE_COUNT)
    const { data: chat } = useQuery<ChatModel>("chat", () => {
        return getOrCreateChat(user.id)
    })
    const chatID = chat?.id

    const isFilesEnabled = user.available_modes.includes("wiki")
    const isDatabaseEnabled = user.available_modes.includes("databases")

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

