import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel, Grid,
    GridItem,
    HStack, Input,
    Select,
    Switch,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react"
import { ModeContext, ModeContextI } from "context/modeContext"
import React, { ChangeEvent, FC, KeyboardEvent, useContext, useState } from "react"
import { IInputGroup, IInputGroupContext } from "component/InputGroup/types"
import InputGroupContext from "component/InputGroup/context"
import AskQueryButton from "component/InputGroup/AskQueryButton"

const InputGroup: FC<IInputGroup> = ({
    setTable,
    isLoading,
    errorMessage,
    openSourcesHistory,
    currentFileIndex
}) => {
    const [limit, setLimit] = useState<number>(100)
    const [query, setQuery] = useState<string>("")
    const { currentMode, setMode, isFilesEnabled, isDatabaseEnabled } = useContext<ModeContextI>(ModeContext)
    const { handleSubmit, similarQueries } = useContext<IInputGroupContext>(InputGroupContext)

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLimit(Number.parseInt(e.target.value))
    }

    const isTextAreaDisable = () => {
        if (isFilesEnabled && currentFileIndex < 0) {
            return true
        }
        return isLoading
    }

    const isSubmitBtnDisable = () => {
        return query.trim() === ""
    }

    const isSubmitButtonLoading = () => {
        if (isFilesEnabled) 
            return isLoading
        return isLoading
    }

    const handleTableSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setTable(event.target.value)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(query, limit)
            setQuery("")
        }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuery(event.target.value)
    }

    const handleIgnoreNullButtonClick = () => {
        setQuery(value => value + " Не учитывай NULL.")
    }

    const handleSwitchMode = () => {
        setMode((prevMode) => prevMode === "databases" ? "wiki" : "databases")
    }

    const handleSubmitClick = () => {
        handleSubmit(query, limit)
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
                        <AskQueryButton query={query} limit={limit} />
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
                    {currentMode !== "wiki" && (
                        <Select placeholder='Выберите таблицу' onChange={handleTableSelectChange}>
                            <option value='платежи' selected>Платежи</option>
                            <option value='сотрудники'>Сотрудники</option>
                        </Select>
                    )}

                    {isFilesEnabled && currentMode === "wiki" && (
                        <Button
                            aria-label="open files history"
                            onClick={openSourcesHistory}
                            children="Документы"
                        />
                    )}
                </VStack>
            </HStack>
            {errorMessage && <Text color="red">{errorMessage}</Text>}

            {currentMode !== "wiki" && (
                <Box>
                    <Button onClick={handleIgnoreNullButtonClick}>Не учитывать NULL</Button>
                    <Text>Максимальное количество строк в ответе</Text>
                    <Input name="limit" type="number" value={limit} onChange={handleLimitChange} />
                </Box>
            )}

            {/* Toggle for files */}
            {isFilesEnabled && isDatabaseEnabled && (
                <FormControl display='flex' alignItems='center'>
                    <FormLabel mb='0'>
                            Режим работы по документам
                    </FormLabel>
                    <Switch
                        isChecked={currentMode === "wiki"}
                        onChange={handleSwitchMode}
                    />
                </FormControl>
            )}
        </Flex>
    )
}

export default InputGroup