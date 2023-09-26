import { Button, Flex, FormControl, FormLabel, HStack, IconButton, Input, Select, Switch, Text, Textarea, VStack } from "@chakra-ui/react"
import { ModeContext, ModeContextI } from "context/modeContext"
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useContext, useRef } from "react"
import { FaFileUpload } from "react-icons/fa"
import { MdOutlineHistory } from "react-icons/md"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    setTable: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
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

    return (
        <Flex direction="column" gap="5">
            <HStack alignItems="flex-start">
                <Textarea
                    height="full"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваш запрос"
                    disabled={isTextAreaDisable()}
                />
                {errorMessage && <Text color="red">{errorMessage}</Text>}
                <VStack alignItems="flex-start">
                    <Button
                        width="full"
                        colorScheme="blue"
                        onClick={handleSubmit}
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