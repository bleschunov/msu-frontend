import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { DatabasePredictionConfigModel } from '../model/DatabasePredictionConfigModel'

export const AdminModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [size, setSize] = useState('full')

    const updateDatabasePredictionConfigMutation = useMutation(updateDatabasePredictionConfig)
    const databasePredictionConfig: DatabasePredictionConfigModel = useQuery(getDatabasePredicitonConfig)

    const handleOpenModal = () => {
        onOpen()
    }

    const handleSaveButtonClick = () => {

    }

    return (
        <>
            {sizes.map((size) => (
                <Button
                    onClick={() => handleSizeClick(size)}
                    key={size}
                    m={4}
                >{`Open ${size} Modal`}</Button>
            ))}

            <Modal onClose={onClose} size={size} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Админка</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Lorem count={2} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Сохранить</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}