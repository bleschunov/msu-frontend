import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { RenderCurrentPageLabelProps, pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { FC } from "react"

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

export const PDFViewer: FC = () => {
    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const pageNavigationPluginInstance = pageNavigationPlugin()
    const { CurrentPageLabel } = pageNavigationPluginInstance

    return (
        <div className="detauls-content" >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl="https://jkhlwowgrekoqgvfruhq.supabase.co/storage/v1/object/public/files/a1d9b1427998cee7e4983c7ab194816e.pdf"
                    plugins={[
                        // defaultLayoutPluginInstance,
                        pageNavigationPluginInstance,
                    ]}
                    defaultScale={SpecialZoomLevel.PageFit}
                />
                <CurrentPageLabel>
                    {(props: RenderCurrentPageLabelProps) => (
                        <span>{`${props.currentPage + 1} of ${props.numberOfPages}`}</span>
                    )}
                </CurrentPageLabel>
            </Worker>
        </div>
    )
}
