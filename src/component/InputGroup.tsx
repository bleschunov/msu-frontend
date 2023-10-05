import {
    Button,
    Circle,
    Flex,
    FormControl,
    FormLabel, Grid, GridItem,
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
import QuestionModel, { QuestionGetModel } from "model/QuestionModel"
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useContext, useRef, useState } from "react"
import { FaFileUpload } from "react-icons/fa"
import { MdEdit, MdOutlineHistory } from "react-icons/md"
import { useQuery } from "react-query"
import TemplateQuestion from './QuestionTemplate'

interface IInputGroup {
    table: string
    setTable: Dispatch<SetStateAction<string>>
    handleSubmit: (finalQuery: string) => void
    isLoading: boolean
    onUploadFiles: (files: FileList) => void
    multipleFilesEnabled?: boolean
    isSourcesExist: boolean
    isUploadingFile: boolean
    errorMessage: string | undefined
    openSourcesHistory: () => void
}

const InputGroup: FC<IInputGroup> = ({
    table,
    setTable,
    handleSubmit,
    isLoading,
    onUploadFiles,
    multipleFilesEnabled = false,
    isSourcesExist,
    isUploadingFile,
    errorMessage,
    openSourcesHistory
}) => {
    const [query, setQuery] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { mode, setMode, isFilesEnabled } = useContext<ModeContextI>(ModeContext)

    const isValueExists = query.trim() === ""

    const {
        data: templateQuestions,
        status: templateQuestionsQueryStatus
    } = useQuery<QuestionModel[]>(
        "templateQuestions",
        () => getTemplateQuestions({
            tables: [table],
            limit: 3
        } as QuestionGetModel)
    )

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

    const isUploadFileBtnLoading = () => {
        if (isFilesEnabled)
            return isLoading || isUploadingFile
        return isLoading
    }

    const handleTableSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setTable(event.target.value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(query)
        }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(event.target.value)
    }

    const handleClick = () => {
        setQuery(value => value + " Не учитывай NULL.")
    }

    const handleSwitchMode = () => {
        setMode((prevMode) => prevMode === "datastep" ? "pdf" : "datastep")
    }

    const handleUploadFileButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files)
            onUploadFiles(files)
    }

    const cleanTemplateQuestion = (templateQuery: string) => {
        return templateQuery.slice(2)
    }

    const handleTemplateQuestionClick = (templateQuery: string) => {
        templateQuery = cleanTemplateQuestion(templateQuery)
        handleSubmit(templateQuery)
    }

    const handleTemplateQuestionEditClick = (templateQuery: string) => {
        templateQuery = cleanTemplateQuestion(templateQuery)
        setQuery(templateQuery)
    }

    const handleSubmitClick = () => {
        handleSubmit(query)
        setQuery("")
    }

    return (
        <Flex direction="column" gap="5">
            {templateQuestionsQueryStatus === "success" && (
                <TemplateQuestion templateQuestions={templateQuestions} />
            )}

            <HStack alignItems="flex-start">
                <Textarea
                    height="full"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваш запрос"
                    disabled={isTextAreaDisable()}
                />
                <VStack alignItems="flex-start">
                    <Button
                        width="full"
                        colorScheme="blue"
                        onClick={handleSubmitClick}
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
                                isLoading={isUploadFileBtnLoading()}
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