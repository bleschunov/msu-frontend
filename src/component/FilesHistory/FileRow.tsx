import React, { FC, MouseEventHandler, useContext } from "react"
import {
    Button,
    Flex,
    IconButton,
    Text, useDisclosure,
} from "@chakra-ui/react"
import { BsCheck } from "react-icons/bs"
import { FaTrashAlt } from "react-icons/fa"
import DeleteFileModal from "component/FilesHistory/DeleteFileModal"
import { IFileRow } from "component/FilesHistory/types"
import { ModeContext } from "context/modeContext"
import { useDeleteFileMutation } from "service/fileService"

const getShortFileName = (filename: string) => {
    if (filename.length > 50)
        return (
            filename.substring(0, 25) +
            "..." +
            filename.substring(filename.length - 25)
        )
    return filename
}

const FileRow: FC<IFileRow> = ({
    file,
    isSelected,
    setThisFileIndex,
}) => {
    const {
        isOpen: isOpenModal,
        onOpen: onOpenModal,
        onClose: onCloseModal,
    } = useDisclosure()

    const { setMode } = useContext(ModeContext)

    const deleteFileMutation = useDeleteFileMutation()

    const handleDeleteFile = () => {
        deleteFileMutation.mutate(file)
        onCloseModal()
    }

    const backgroundColor = isSelected ? "gray.100" : "transparent"

    const handleSelectButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
        setMode("pdf")
        setThisFileIndex()
    }

    let buttons
    if (isSelected) {
        buttons = <BsCheck size={24} />
    } else {
        buttons = (
            <Flex gap={10}>
                <Button
                    colorScheme="blue"
                    variant="link"
                    size="sm"
                    onClick={handleSelectButtonClick}
                >
                    Выбрать
                </Button>
                <IconButton
                    aria-label="close-button"
                    colorScheme="red"
                    icon={<FaTrashAlt color="white" />}
                    isLoading={deleteFileMutation.isLoading}
                    onClick={onOpenModal}
                />

                <DeleteFileModal
                    handleDeleteFile={handleDeleteFile}
                    isOpenModal={isOpenModal}
                    onCloseModal={onCloseModal}
                />
            </Flex>
        )
    }

    return (
        <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            backgroundColor={backgroundColor}
            padding={3}
            borderRadius={10}
        >
            <Flex direction="column">
                <Text>{getShortFileName(file.name_ru)}</Text>
            </Flex>
            {buttons}
        </Flex>
    )
}

export default FileRow