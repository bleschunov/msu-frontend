import {
    Button,
    Flex,
    FormControl,
    FormLabel, Grid,
    GridItem,
    HStack,
    IconButton,
    Input,
    Select,
    Switch,
    Text,
    Textarea,
    VStack,
} from '@chakra-ui/react'
import { ModeContext, ModeContextI } from "context/modeContext"
import { ChangeEvent, FC, KeyboardEvent, useContext, useRef, useState } from "react"
import { FaFileUpload } from "react-icons/fa"
import { MdOutlineHistory } from "react-icons/md"
import { IInputGroup, IInputGroupContext } from './types'
import InputGroupContext from './context'
import AskQueryButton from './AskQueryButton'
import Accordion from '../Accordion'

const InputGroup: FC<IInputGroup> = ({
    setTable,
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
    const { handleSubmit, similarQueries } = useContext<IInputGroupContext>(InputGroupContext)

    const isValueExists = query.trim() === ""

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

    const handleSubmitClick = () => {
        handleSubmit(query)
        setQuery("")
    }

    return (
        <Flex direction="column" gap="5">
            <Grid
                h='200px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(2, 1fr)'
                gap={4}
            >
                {similarQueries.map((query: string) => (
                    <GridItem>
                        <AskQueryButton query={query} />
                    </GridItem>
                ))}
            </Grid>

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
            
            <Accordion
                titles={["Дополнительные настройки"]}
                panels={[<Button onClick={handleClick}>Не учитывать NULL</Button>]}
                defaultIndex={-1}
            />

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