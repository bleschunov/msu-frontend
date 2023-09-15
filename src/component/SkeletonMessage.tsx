import React from "react"
import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react"

interface SkeletonMessageI {
    direction: "incoming" | "outgoing"
    width: string
    height: string
}

const SkeletonMessage = ({ direction, width, height }: SkeletonMessageI) => {
    let justify, flexDirection

    if (direction === "incoming") {
        justify = "start" as const
        flexDirection = "row" as const
    }

    if (direction === "outgoing") {
        justify = "end" as const
        flexDirection = "row-reverse" as const
    }

    return (
        <Flex
            justify={justify}
            flexDirection={flexDirection}
            gap="10px"
        >
            <SkeletonCircle size="10" />
            <Skeleton height={height} width={width} />
        </Flex>
    )
}

export default SkeletonMessage