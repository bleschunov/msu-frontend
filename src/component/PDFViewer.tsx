import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { FC, useEffect } from "react"

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { VStack } from "@chakra-ui/react"
import { getHostPath } from "misc/util"

interface IPDFViewer {
    fileUrl: string
    page: number
}

const getFullFilePath = (fileUrl: string): string => {
    const host = getHostPath()
    return `${host}/${fileUrl}`
}

export const PDFViewer: FC<IPDFViewer> = ({ page, fileUrl }) => {
    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const pageNavigationPluginInstance = pageNavigationPlugin()
    const { jumpToPage } = pageNavigationPluginInstance
    const fullFileUrl = getFullFilePath(fileUrl)

    useEffect(() => {
        jumpToPage(page)
    }, [page, jumpToPage])

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <VStack
                width="40vw"
                height="100vh"
            >
                <Viewer
                    fileUrl={fullFileUrl}
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