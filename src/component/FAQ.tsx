import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Heading, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { FaQuestion } from "react-icons/fa6"

export function FAQ() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <IconButton 
                aria-label="question-button"
                icon={<FaQuestion color="black" />}
                isRound = {true}
                onClick={onOpen}
            />    
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Heading mb={4}>Видеоинструкция</Heading>
                        <video controls>
                            <source src="/image/Instructions.mp4" type="video/mp4"></source>
                        </video>
                        <Heading mt={4} mb={4}>Интерфейс</Heading>
                        <span>
                            Работа в сервисе выглядит, как общение с чат-ботом. Есть кнопка "Документы", нажав на которую
                            открывается панель с ранее загруженными документами и есть кнопка "Загрузить документ". 
                            После ответа сервиса на запрос, можно оценить его и добавить коментарий. 
                            Еще после ответа сервиса на запрос предлагает варианты запросов для дальнейшей работы
                        </span>
                        <Accordion mt={10} allowToggle>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" fontWeight="bold" flex='1' textAlign='left'>
                                            1. Вход в Сервис
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    На этапе авторизации введите логин и пароль. Войдите в свой аккаунт.
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" fontWeight="bold" flex='1' textAlign='left'>
                                            2. Запрос данных
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    На главной странице вы увидите чат-бота, с которым можно взаимодействовать.
                                    Введите свой запрос, например, "Сколько заработала компания за прошлый месяц?"
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" flex='1' fontWeight="bold" textAlign='left'>
                                            3. Поиск по Документам
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    Нужно найти информацию в документах? Нажмите кнопку "Режим работы по документам",
                                    а затем "Документы". На панели с ранее загруженными документами выберите нужный файл. 
                                    Слева откроется вкладка с документом, и подходящая информация по запросу, будет подсвечена. 
                                    Если нужного файла, нет, то загрузите его через кнопку "Загрузить файл".
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" fontWeight="bold" flex='1' textAlign='left'>
                                            4. Работа с Результатами
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    После ввода запроса, сервис быстро предоставит информацию, которую вы искали.
                                    Вы можете оценить ответ и добавить комментарий, чтобы отметить его полезность.
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box as="span" fontWeight="bold" flex='1' textAlign='left'>
                                            5. Дальнейшая Работа
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    После ответа на ваш запрос, сервис предложит варианты дополнительных вопросов, 
                                    чтобы уточнить или расширить ваш запрос.
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}