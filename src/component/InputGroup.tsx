import {
    Button,
    Circle,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
    Input,
    Select, Spacer,
    Switch,
    Text,
    Textarea,
    VStack,
} from '@chakra-ui/react'
import { getTemplateQuestions } from "api/questionsApi"
import { ModeContext, ModeContextI } from "context/modeContext"
import QuestionModel from "model/QuestionModel"
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useContext, useRef } from "react"
import { FaFileUpload } from "react-icons/fa"
import { MdEdit, MdOutlineHistory } from "react-icons/md"
import { useQuery } from "react-query"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    setTable: Dispatch<SetStateAction<string>>
    handleSubmit: (customQuery?: string) => void
    isLoading: boolean
    onUploadFiles: (files: FileList) => void
    multipleFilesEnabled?: boolean
    isSourcesExist: boolean
    isUploadingFile: boolean
    errorMessage: string | undefined
    openSourcesHistory: () => void
}

const InputGroup: FC<IInputGroup> = ({
    value,
    setValue,
    handleSubmit,
    isLoading,
    onUploadFiles,
    multipleFilesEnabled = false,
    isSourcesExist,
    isUploadingFile,
    setTable,
    errorMessage,
    openSourcesHistory
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { mode, setMode, isFilesEnabled } = useContext<ModeContextI>(ModeContext)

    const {
        data: templateQuestions,
        status: templateQuestionsQueryStatus
    } = useQuery<QuestionModel[]>(
        "templateQuestions",
        () => {
            return getTemplateQuestions(3)
        })

    const handleTableSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setTable(event.target.value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit()
        }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value)
    }

    const handleClick = () => {
        setValue(value => value + " Не учитывай NULL.")
    }

    const handleSwitchMode = () => {
        setMode((prevMode) => prevMode === "datastep" ? "pdf" : "datastep")
    }

    const isValueExists = value.trim() === ""

    const isTextAreaDisable = () => {
        if (isFilesEnabled)
            return isLoading || isUploadingFile || !isSourcesExist
        return isLoading
    }
    const isSubmitBtnDisable = () => {
        if (isFilesEnabled)
            return isValueExists || isUploadingFile || !isSourcesExist
        return isValueExists
    }

    const isSubmitButtonLoading = () => {
        if (isFilesEnabled) 
            return isLoading || isUploadingFile
        return isLoading
    }

    const uploadFileBtnIsLoading = () => {
        if (isFilesEnabled)
            return isLoading || isUploadingFile
        return isLoading
    }

    const handleUploadFileButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files)
            onUploadFiles(files)
    }

    const OnTemplateQuestionClick = (templateRequest: string) => {
        handleSubmit(templateRequest)
    }

    const OnTemplateQuestionEditClick = (templateRequest: string) => {
        setValue(templateRequest)
    }

    return (
        <Flex direction="column" gap="5">
            {templateQuestionsQueryStatus === "success" && (
                <Flex
                    w="full"
                    direction="row"
                    gap={5}
                    overflowY="hidden"
                >
                    {templateQuestions?.map(({ question }) => (
                        <Flex
                            w="full"
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            fontStyle="italic"
                            borderWidth={2}
                            borderColor="gray.200"
                            borderRadius={10}
                            gap={1}
                            cursor="pointer"
                            _hover={{
                                background: "gray.200"
                            }}
                        >
                            <HStack w="full" p="1">
                                <Spacer />
                                <Circle size="30px" _hover={{ background: "gray.400" }} cursor="pointer">
                                    <MdEdit
                                        size={24}
                                        onClick={() => OnTemplateQuestionEditClick(question)}
                                    />
                                </Circle>
                            </HStack>
                            <Text
                                // TODO: fix text only in 1 full line to enable horizontal scrolling
                                w="fit-content"
                                wordBreak="keep-all"
                                onClick={() => OnTemplateQuestionClick(question)}
                                p="2"
                            >
                                {question}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
            )}

            <HStack alignItems="flex-start">
                <Textarea
                    height="full"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваш запрос"
                    disabled={isTextAreaDisable()}
                />
                <VStack alignItems="flex-start">
                    <Button
                        width="full"
                        colorScheme="blue"
                        onClick={() => handleSubmit()}
                        isLoading={isSubmitButtonLoading()}
                        isDisabled={isSubmitBtnDisable()}
                    >
                        Отправить
                    </Button>
                    <Select placeholder='Выберите таблицу' onChange={handleTableSelectChange}>
                        <option value='платежи' selected>Платежи</option>
                        <option value='сотрудники'>Сотрудники</option>
                    </Select>

                    {isFilesEnabled && (
                        <Flex direction="row" gap={1}>
                            <Button
                                colorScheme="gray"
                                onClick={handleUploadFileButtonClick}
                                isLoading={uploadFileBtnIsLoading()}
                                fontWeight="normal"
                                gap={2}
                            >
                                <FaFileUpload />
                                Загрузить файл
                            </Button>
                            <Input
                                hidden
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                multiple={multipleFilesEnabled}
                                onChange={handleFileInputChange}
                            />

                            <IconButton
                                aria-label="open files history"
                                onClick={openSourcesHistory}
                                icon={<MdOutlineHistory size={24} />}
                            />
                        </Flex>
                    )}
                </VStack>
            </HStack>
            {errorMessage && <Text color="red">{errorMessage}</Text>}
            
            <Button onClick={handleClick}>Не учитывать NULL</Button>

            {/* Toggle for files */}
            {isFilesEnabled && (
                <FormControl display='flex' alignItems='center'>
                    <FormLabel mb='0'>
                            Режим работы по документам
                    </FormLabel>
                    <Switch
                        isChecked={mode === "pdf"}
                        onChange={handleSwitchMode}
                    />
                </FormControl>
            )}
        </Flex>
    )
}

export default InputGroup