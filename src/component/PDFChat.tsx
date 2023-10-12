// import { Flex } from "@chakra-ui/react"
// import { getAllFiles } from "api/fileApi"
// import FileModel from "model/FileModel"
// import { FC, useContext, useState } from "react"
// import { useQuery } from "react-query"
// import Chat from "component/Chat"
// import { PDFViewer } from "component/PDFViewer"
// import { ModeContext, ModeContextI } from "context/modeContext"

// export const PDFChat: FC = () => {
//     const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1)
//     const [currentPage, setCurrentPage] = useState<number>(0)
//     const {
//         isFilesEnabled,
//     } = useContext<ModeContextI>(ModeContext)

//     const { data: filesList } = useQuery<FileModel[]>("files_list", getAllFiles)

//     return (
//         <Flex
//             position="relative"
//             direction="row"
//             justifyContent="space-between"
//             alignItems="flex-start"
//             pt="100"
//             pb="10"
//             // gap={10} 
//             h="full"
//         >
//             {isFilesEnabled && filesList && currentFileIndex >= 0
//                     && (<PDFViewer 
//                         fileUrl={filesList[currentFileIndex].url} 
//                         page={currentPage}
//                     />
//                     )}
//             <Flex>
//                 <Chat/>
//             </Flex>
//         </Flex>
//     )
// }
export {}