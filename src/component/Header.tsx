import React from 'react';
import {Button, Heading, HStack} from "@chakra-ui/react";
import {signOut} from "../api/supabase";
import {LOGO_TEXT} from '../misc/const';

const Header = () => {
    return (
        <HStack bg="gray.100" h="50px" flexShrink="0" justify="space-between" px="10" py="5">
            <Heading>{LOGO_TEXT}</Heading>
            <Button colorScheme="blue" onClick={signOut}>Выйти</Button>
        </HStack>
    );
};

export default Header;