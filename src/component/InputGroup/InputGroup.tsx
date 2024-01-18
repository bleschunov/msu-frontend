import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    HStack, Input,
    Select,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react"
import { ModeContext, ModeContextI } from "context/modeContext"
import React, { ChangeEvent, FC, KeyboardEvent, useContext, useEffect, useState } from "react"
import { IInputGroup, IInputGroupContext } from "component/InputGroup/types"
import InputGroupContext from "component/InputGroup/context"
import AskQueryButton from "component/InputGroup/AskQueryButton"
import { FavoriteMessageContext, IFavoriteMessageContext } from "context/favoriteMessageContext"

const InputGroup: FC<IInputGroup> = ({
    setTable,
    isLoading,
    errorMessage,
    openSourcesHistory,
    currentFileIndex
}) => {
    const [limit, setLimit] = useState<number>(100)
    const [query, setQuery] = useState<string>("")
    const { currentMode, isFilesEnabled } = useContext<ModeContextI>(ModeContext)
    const { handleSubmit, similarQueries } = useContext<IInputGroupContext>(InputGroupContext)
    const { selectedFavoriteQuery } = useContext<IFavoriteMessageContext>(FavoriteMessageContext)

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLimit(Number.parseInt(e.target.value))
    }

    const isTextAreaDisable = () => {
        if (isFilesEnabled && currentMode === "wiki" && currentFileIndex < 0) {
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

    const handleSubmitClick = () => {
        handleSubmit(query, limit)
        setQuery("")
    }

    useEffect(() => {
        setQuery(selectedFavoriteQuery)
    },[selectedFavoriteQuery])

    return (
        <Flex direction="column" gap="5">
            <Grid
                h='200px'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(2, 1fr)'
                gap={4}
            >
                {similarQueries && similarQueries.map((query: string) => (
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
                <HStack gap="55">
                    <Button onClick={handleIgnoreNullButtonClick}>Не учитывать NULL</Button>
                    <Box>
                        <Text>Максимальное количество строк в ответе</Text>
                        <Input name="limit" type="number" value={limit} onChange={handleLimitChange} />
                    </Box>
                </HStack>
            )}
        </Flex>
    )
}

export default InputGroup