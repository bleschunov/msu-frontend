import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Text } from "@chakra-ui/react"
import queryClient from "api/queryClient"
import { formatDate } from "misc/util"
import SourceModel from "model/SourceModel"
import { FC, MouseEvent, useEffect, useRef } from "react"
import { BsCheck } from "react-icons/bs"

interface ISourcesList {
    sourceList?: SourceModel[]
    currentSource?: SourceModel
    isOpen: boolean
    onClose: () => void
}

const SourcesList: FC<ISourcesList> = ({
    sourceList = [],
    currentSource,
    isOpen,
    onClose
}) => {
    const lastSourceRef = useRef<HTMLDivElement | null>(null)

    const setCurrentSource = (selectedSource: SourceModel) => {
        queryClient.cancelQueries("currentSource")
        queryClient.setQueryData("currentSource", selectedSource)
    }

    const getShortFileName = (filename: string) => {
        if (filename.length > 30)
            return filename.substring(0, 10) + "..." + filename.substring(filename.length - 10)
        return filename
    }

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                lastSourceRef.current?.scrollIntoView({
                    behavior: "smooth"
                })
            }, 0)
        }
    }, [isOpen, sourceList])

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
                    {sourceList?.map((sourceItem, index) => (
                        <Flex
                            ref={index === sourceList.length - 1 ? lastSourceRef : null}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            backgroundColor={sourceItem.id === currentSource.id ? "gray.100" : "transparent"}
                            padding={3}
                            borderRadius={10}
                        >
                            <Flex direction="column">
                                <Text>
                                    {getShortFileName(sourceItem.file_name)}
                                </Text>
                                <Text color="gray" fontSize="xs">
                                    {formatDate(sourceItem.created_at)}
                                </Text>
                            </Flex>
                            {currentSource?.id === sourceItem.id ? (
                                <BsCheck size={24}/>
                            ) : (
                                <Button
                                    colorScheme="blue"
                                    variant="link"
                                    size="sm"
                                    onClick={() => {
                                        setCurrentSource(sourceItem)
                                    }}
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
