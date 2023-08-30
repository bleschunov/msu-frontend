import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react"

type ModeT = "datastep" | "pdf"

interface ModeContextI {
    mode: ModeT
    setMode: Dispatch<SetStateAction<ModeT>>
    shownMessageCount: number
    setShownMessageCount: Dispatch<SetStateAction<number>>
}

const ModeContext = createContext<ModeContextI>({} as ModeContextI)

interface ModeContextProviderProps {
    children: ReactNode
}

const ModeContextProvider: FC<ModeContextProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ModeT>("datastep")
    const [shownMessageCount, setShownMessageCount] = useState<number>(2)

    return (
        <ModeContext.Provider value={{ mode, setMode, shownMessageCount, setShownMessageCount }}>
            {children}
        </ModeContext.Provider>
    )
}

export {
    ModeContextProvider,
    ModeContext
}

export type {
    ModeContextI,
    ModeT
}