import React from 'react';
import {Button, Heading, HStack} from "@chakra-ui/react";
import {signOut} from "../api/supabase";
import {LOGO_TEXT} from '../misc/const';
import {useQueryClient} from "react-query";

const Header = () => {
    const queryClient = useQueryClient()

    const handleSignOut = () => {
        signOut()
        queryClient.clear()
    }

    return (
        <HStack bg="gray.100" h="50px" flexShrink="0" justify="space-between" px="10" py="5">
            <Heading>{LOGO_TEXT}</Heading>
            <Button colorScheme="blue" onClick={handleSignOut}>Выйти</Button>
        </HStack>
    );
};

export default Header;