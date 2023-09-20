import queryClient from "api/queryClient"
import ChatModel from "model/ChatModel"
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"

type ModeT = "datastep" | "pdf"

interface ModeContextI {
    mode: ModeT
    setMode: Dispatch<SetStateAction<ModeT>>
    shownMessageCount: number
    setShownMessageCount: Dispatch<SetStateAction<number>>
    chatID: number | undefined
}

const ModeContext = createContext<ModeContextI>({} as ModeContextI)

interface ModeContextProviderProps {
    children: ReactNode
}

const ModeContextProvider: FC<ModeContextProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ModeT>("datastep")
    const [shownMessageCount, setShownMessageCount] = useState<number>(2)
    const chatID = queryClient.getQueryData<ChatModel>("chat")?.id

    return (
        <ModeContext.Provider value={{ mode, setMode, shownMessageCount, setShownMessageCount, chatID }}>
            {children}
        </ModeContext.Provider>
    )
}

const InitialMessageCount: number = 2



export {
    ModeContextProvider,
    ModeContext,
    InitialMessageCount,
}

export type {
    ModeContextI,
    ModeT
}