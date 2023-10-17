import React, { FC, MouseEventHandler } from 'react'
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react'
import { IDeleteFileModal } from './types'

const DeleteFileModal: FC<IDeleteFileModal> = ({ isOpenModal, onCloseModal, handleDeleteFile }) => {
    const handleDeleteButtonClick: MouseEventHandler<HTMLButtonElement> = (_) => {
        handleDeleteFile()
    }

    return (
        <Modal
            isOpen={isOpenModal}
            onClose={onCloseModal}
            isCentered
        >
            <ModalContent>
                <ModalHeader>Удалить файл</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Вы уверены, что хотите удалить файл?
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={onCloseModal}>
                        Отмена
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={handleDeleteButtonClick}
                    >
                        Удалить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteFileModal