import React, { FC } from "react"
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react"
import { IAdvancedSettings } from "component/InputGroup/types"
import Accordion from "component/Accordion"

const AdvancedSettings: FC<IAdvancedSettings> = ({
    handleIgnoreNullButtonClick,
    limit,
    handleLimitChange
}) => {
    return (
        <Accordion
            titles={["Дополнительные настройки"]}
            panels={[
                <HStack gap="20">
                    <Button onClick={handleIgnoreNullButtonClick}>Не учитывать NULL</Button>
                    <Box>
                        <Text>Ограничение на количество строк</Text>
                        <Input name="limit" type="number" value={limit} onChange={handleLimitChange} />
                    </Box>
                </HStack>
            ]}
            defaultIndex={-1}
        />
    )
}

export default AdvancedSettings