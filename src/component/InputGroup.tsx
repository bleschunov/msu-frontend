import { Button, Flex, FormControl, FormLabel, HStack, IconButton, Input, Switch, Select, Textarea, Tooltip, VStack } from "@chakra-ui/react"
import { ModeContext, ModeContextI } from "context/modeContext"
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useContext, useRef } from "react"
import useKeypress from "react-use-keypress"
import { useQuery } from "misc/util"
import { FaFileUpload } from "react-icons/fa"
import { FF_CHAT_PDF } from "types/FeatureFlags"

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
    setTable
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    useKeypress("Enter", handleSubmit)

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

    const isTextAreaDisable = isFilesEnabled ? isLoading || isUploadingFile || !isSourcesExist : isLoading
    const isSubmitBtnDisable = isFilesEnabled ? isValueExists || isUploadingFile || !isSourcesExist : isValueExists

    const submitBtnIsLoading = isFilesEnabled ? isLoading || isUploadingFile : isLoading
    const uploadFileBtnIsLoading = isFilesEnabled ? isLoading || isUploadingFile : isLoading

    return (
        <Flex direction="column" gap="5">
            <HStack alignItems="flex-start">
                <Textarea
                    height="100%"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите ваш запрос"
                    disabled={isTextAreaDisable}
                />
                <VStack alignItems="flex-start">
                    <Button
                        width="100%"
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={submitBtnIsLoading}
                        isDisabled={isSubmitBtnDisable}
                    >
                        Отправить
                    </Button>
                    <Select placeholder='Выберите таблицу' onChange={handleTableSelectChange}>
                        <option value='платежи' selected>Платежи</option>
                        <option value='сотрудники'>Сотрудники</option>
                    </Select>

                    {isFilesEnabled && (
                        <>
                            <Button
                                colorScheme="gray"
                                onClick={() => {
                                    fileInputRef.current?.click()
                                }}
                                isLoading={uploadFileBtnIsLoading}
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
                                onChange={(e) => {
                                    const files = e.target.files
                                    if (files)
                                        onUploadFiles(files)
                                }}
                            />
                        </>
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
                        onChange={() => {
                            handleSwitchMode()
                        }}
                    />
                </FormControl>
            )}
        </Flex>
    )
}

export default InputGroup