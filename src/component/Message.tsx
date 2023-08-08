import {Card, CardBody, Flex, Text} from "@chakra-ui/react";
import {FC, ReactNode} from "react";

interface IMessage {
    children: ReactNode
    direction: "incoming" | "outgoing"
}

export const Message: FC<IMessage> = ({ direction, children }) => {
    return (
        <Flex justify={direction === "incoming" ? "start" : "end"}>
            <Card>
                <CardBody>
                    <Text>{children}</Text>
                </CardBody>
            </Card>
        </Flex>
    )
}