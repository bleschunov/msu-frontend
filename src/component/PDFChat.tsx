import { FC } from "react"
import { PDFViewer } from "./PDFViewer"
import Chat from "./Chat"

export const PDFChat: FC = () => {
    return (
        <>
            <PDFViewer/>
            <Chat/>
        </>
    )
}