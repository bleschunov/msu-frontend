import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Text,
} from "@chakra-ui/react"
import { Dispatch, FC, SetStateAction, useRef } from 'react'
import { BsCheck } from "react-icons/bs"
import FileModel from '../model/FileModel'

interface ISourcesList {
    filesList: FileModel[]
    currentFileIndex: number
    setCurrentFileIndex: Dispatch<SetStateAction<number>>
    isOpen: boolean
    onClose: () => void
}

const SourcesList: FC<ISourcesList> = ({
    filesList,
    currentFileIndex,
    setCurrentFileIndex,
    isOpen,
    onClose
}) => {
    const lastSourceRef = useRef<HTMLDivElement | null>(null)

    const getShortFileName = (filename: string) => {
        if (filename.length > 30)
            return filename.substring(0, 10) + "..." + filename.substring(filename.length - 10)
        return filename
    }

    // useEffect(() => {
    //     if (isOpen) {
    //         setTimeout(() => {
    //             lastSourceRef.current?.scrollIntoView({
    //                 behavior: "smooth"
    //             })
    //         }, 0)
    //     }
    // }, [isOpen, sourceList])

    return (
        <Drawer onClose={onClose} isOpen={isOpen} size="sm">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>История файлов</DrawerHeader>
                <DrawerBody
                    display="flex"
                    flexDirection="column"
                    paddingBottom={10}
                >
                    {filesList?.map((file, index) => (
                        <Flex
                            // ref={index === sourceList.length - 1 ? lastSourceRef : null}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            backgroundColor={index === currentFileIndex ? "gray.100" : "transparent"}
                            padding={3}
                            borderRadius={10}
                        >
                            <Flex direction="column">
                                <Text>
                                    {getShortFileName(file.name_ru)}
                                </Text>
                            </Flex>
                            {index === currentFileIndex ? (
                                <BsCheck size={24}/>
                            ) : (
                                <Button
                                    colorScheme="blue"
                                    variant="link"
                                    size="sm"
                                    onClick={() => setCurrentFileIndex(index)}
                                >
                                    Выбрать
                                </Button>
                            )}
                        </Flex>
                    ))}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default SourcesList
