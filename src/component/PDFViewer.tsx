import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { Dispatch, FC, SetStateAction, useEffect } from "react"

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { Button, VStack } from "@chakra-ui/react"

export const PDFViewer: FC = () => {
    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const pageNavigationPluginInstance = pageNavigationPlugin()
    const { jumpToPage } = pageNavigationPluginInstance

    const { CurrentPageLabel } = pageNavigationPluginInstance

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <VStack
                width={700}
                position="fixed"
                zIndex={100}
                height={1000}
            >
                <Button 
                    onClick={() => jumpToPage(2)}
                >
                    Перейти на страницу с ответом
                </Button>
                <Viewer
                    fileUrl="https://jkhlwowgrekoqgvfruhq.supabase.co/storage/v1/object/public/files/a1d9b1427998cee7e4983c7ab194816e.pdf"
                    plugins={[
                        defaultLayoutPluginInstance,
                        pageNavigationPluginInstance,
                    ]}
                    defaultScale={SpecialZoomLevel.PageFit}
                />
            </VStack>
        </Worker>
    )
}
function jumpToPagePlugin() {
    throw new Error("Function not implemented.")
}

