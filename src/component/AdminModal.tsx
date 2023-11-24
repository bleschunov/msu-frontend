import {
    Box,
    Button, FormControl, HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Switch, Tooltip,
    useDisclosure
} from "@chakra-ui/react"
import { FC } from "react"
import { useMutation } from "react-query"
import queryClient from "api/queryClient"
import { DatabasePredictionConfigModel } from "model/DatabasePredictionConfigModel"
import { updateDatabasePredictionConfig } from "api/databasePredictionConfigApi"
import { QuestionIcon } from "@chakra-ui/icons"

interface IAdminModal {
    adminModalFunctions: ReturnType<typeof useDisclosure>
    databasePredictionConfig: DatabasePredictionConfigModel
}

export const AdminModal: FC<IAdminModal> = ({ adminModalFunctions, databasePredictionConfig }) => {
    const { onClose } = adminModalFunctions

    const updateDatabasePredictionConfigMutation = useMutation("updateDatabasePredictionConfig", updateDatabasePredictionConfig)

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
                            <HStack alignItems="center">
                                <Box>Проверка наличия нужных данных для ответа на вопрос</Box>
                                <Tooltip ml="5" label="Повышает точность ответа, но ответ генерируется дольше." aria-label="alternative questions tooltip">
                                    <QuestionIcon />
                                </Tooltip>
                                <Switch
                                    ml="2"
                                    id="is_check_data"
                                    defaultChecked={databasePredictionConfig?.is_data_check}
                                    onChange={(event) => queryClient.setQueryData<DatabasePredictionConfigModel>("getDatabasePredictionConfig", (prev_data) => {
                                        return { ...prev_data!, is_data_check: event.target.checked }
                                    })}
                                />
                            </HStack>
                            <HStack mt="5">
                                <Box>Словесное описание алгоритма для получения ответа</Box>
                                <Tooltip label="Вы сможете проверить логику получения ответа, но ответ будет генерироваться дольше." aria-label="alternative questions tooltip">
                                    <QuestionIcon />
                                </Tooltip>
                                <Switch
                                    ml="2"
                                    id="is_sql_description"
                                    defaultChecked={databasePredictionConfig?.is_sql_description}
                                    onChange={(event) => queryClient.setQueryData<DatabasePredictionConfigModel>("getDatabasePredictionConfig", (prev_data) => {
                                        return { ...prev_data!, is_sql_description: event.target.checked }
                                    })}
                                />
                            </HStack>
                            <HStack mt="5">
                                <Box>Генерация похожих вопросов</Box>
                                <Tooltip label="Не влияет на скорость получения ответа." aria-label="alternative questions tooltip">
                                    <QuestionIcon />
                                </Tooltip>
                                <Switch
                                    ml="2"
                                    id="is_alternative_questions"
                                    defaultChecked={databasePredictionConfig?.is_alternative_questions}
                                    onChange={(event) => queryClient.setQueryData<DatabasePredictionConfigModel>("getDatabasePredictionConfig", (prev_data) => {
                                        return { ...prev_data!, is_alternative_questions: event.target.checked }
                                    })}
                                />
                            </HStack>
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