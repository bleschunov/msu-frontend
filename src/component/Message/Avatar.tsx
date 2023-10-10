import React, { FC } from "react"
import { Avatar as ChakraAvatar } from "@chakra-ui/react"
import { IAvatar } from './types'

const Avatar: FC<IAvatar> = ({ name, src }) => {
    return (
        <ChakraAvatar name={name} src={src} />
    )
}

export default Avatar