import {
    Box,
    Button, FormControl, FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Switch,
    useDisclosure,
} from "@chakra-ui/react"
import { FC } from "react"
import { useMutation, useQuery } from "react-query"
import queryClient from "api/queryClient"
import { DatabasePredictionConfigModel } from "model/DatabasePredictionConfigModel"
import { getDatabasePredictionConfig, updateDatabasePredictionConfig } from "api/databasePredictionConfigApi"

interface IAdminModal {
    adminModalFunctions: ReturnType<typeof useDisclosure>
}

export const AdminModal: FC<IAdminModal> = ({ adminModalFunctions }) => {
    const { onClose } = adminModalFunctions

    const updateDatabasePredictionConfigMutation = useMutation("updateDatabasePredictionConfig", updateDatabasePredictionConfig)
    const { data: databasePredictionConfig } = useQuery("getDatabasePredictionConfig", getDatabasePredictionConfig)

    const handleSaveDatabasePredictionConfig = () => {
        if (databasePredictionConfig) {
            updateDatabasePredictionConfigMutation.mutate(databasePredictionConfig)
        }
    }

    const handleCloseButtonClick = () => {
        handleSaveDatabasePredictionConfig()
        onClose()
    }

    return (
        <>
            <Modal onClose={onClose} size="full" isOpen={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Админка</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <Box>
                                <FormLabel>Проверять, есть ли информация в базе данных?</FormLabel>
                                <Switch
                                    id="is_check_data"
                                    defaultChecked={databasePredictionConfig?.is_data_check}
                                    onChange={(event) => queryClient.setQueryData<DatabasePredictionConfigModel>("getDatabasePredictionConfig", (prev_data) => {
                                        return { ...prev_data!, is_data_check: event.target.checked }
                                    })}
                                />
                            </Box>
                            <Box mt="5">
                                <FormLabel>Объяснять, как получился ответ?</FormLabel>
                                <Switch
                                    id="is_sql_description"
                                    defaultChecked={databasePredictionConfig?.is_sql_description}
                                    onChange={(event) => queryClient.setQueryData<DatabasePredictionConfigModel>("getDatabasePredictionConfig", (prev_data) => {
                                        return { ...prev_data!, is_sql_description: event.target.checked }
                                    })}
                                />
                            </Box>
                            <Box mt="5">
                                <FormLabel>Генерировать похожие вопросы?</FormLabel>
                                <Switch
                                    id="is_alternative_questions"
                                    defaultChecked={databasePredictionConfig?.is_alternative_questions}
                                    onChange={(event) => queryClient.setQueryData<DatabasePredictionConfigModel>("getDatabasePredictionConfig", (prev_data) => {
                                        return { ...prev_data!, is_alternative_questions: event.target.checked }
                                    })}
                                />
                            </Box>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter gap="5">
                        <Button onClick={handleSaveDatabasePredictionConfig} isLoading={updateDatabasePredictionConfigMutation.isLoading}>Сохранить</Button>
                        <Button onClick={handleCloseButtonClick}>Закрыть</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}