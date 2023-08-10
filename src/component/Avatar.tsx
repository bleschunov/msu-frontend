import React, {FC} from 'react';
import {Avatar as ChakraAvatar} from "@chakra-ui/react";

interface IAvatar {
    name: string
    src: string
}

const Avatar: FC<IAvatar> = ({ name, src }) => {
    return (
        <ChakraAvatar name={name} src={src} />
    );
};

export default Avatar;