import { Button, Flex, FormControl, FormLabel, HStack, Input, Switch, Textarea, VStack } from "@chakra-ui/react"
import { ModeT } from "context/modeContext"
import { ChangeEvent, Dispatch, FC, KeyboardEvent, SetStateAction, useRef } from "react"
import { FaFileUpload } from "react-icons/fa"
import useKeypress from "react-use-keypress"

interface IInputGroup {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
    isLoading: boolean
    setFiles?: Dispatch<SetStateAction<FileList | null>>
    multipleFilesEnabled?: boolean
    mode: ModeT
    setMode: Dispatch<SetStateAction<ModeT>>
    isSourcesExist: boolean
    isUploadingFile: boolean
    isFilesEnabled: boolean
}

const InputGroup: FC<IInputGroup> = ({
    value,
    setValue,
    handleSubmit,
    isLoading,
    setFiles = () => {},
    multipleFilesEnabled = false,
    mode,
    setMode,
    isSourcesExist,
    isUploadingFile,
    isFilesEnabled
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    useKeypress("Enter", handleSubmit)
    
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
                                    setFiles(e.target.files)
                                    setMode("pdf")
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