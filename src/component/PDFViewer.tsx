import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation"
import { FC, useEffect } from "react"

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"
import { Box, Drawer, DrawerContent, VStack, useColorModeValue, useDisclosure } from "@chakra-ui/react"

interface IPDFViewer {
    fileUrl: string
    page: number
}

export const PDFViewer: FC<IPDFViewer> = ({ page, fileUrl }) => {
    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const pageNavigationPluginInstance = pageNavigationPlugin()
    const { jumpToPage } = pageNavigationPluginInstance

    useEffect(() => {
        jumpToPage(page)
    }, [page, jumpToPage])

    const { isOpen, onClose } = useDisclosure()

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <VStack>
                <Box minH="100vh" minW="42vw">
                    <Drawer
                        isOpen={isOpen}
                        placement="left"
                        onClose={onClose}
                        returnFocusOnClose={false}
                        size="full">
                        <DrawerContent />
                    </Drawer>
                    <Box ml={{ base: 0, md: 0 }}>
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[
                                defaultLayoutPluginInstance,
                                pageNavigationPluginInstance,
                            ]}
                            defaultScale={SpecialZoomLevel.PageFit}
                        />
                    </Box>
                </Box>
            </VStack>
        </Worker>
    )
}