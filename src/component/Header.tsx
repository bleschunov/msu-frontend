import React from 'react'
import { Button, HStack } from '@chakra-ui/react'
import { signOut } from '../api/supabase'
import { useQueryClient } from 'react-query'
import Logo from './Logo'

const Header = () => {
    const queryClient = useQueryClient()

    const handleSignOut = () => {
        signOut()
        queryClient.clear()
    }

    return (
        <HStack bg="gray.100" h="100px" flexShrink="0" justify="space-between" px="10" py="5">
            <Logo />
            <Button colorScheme="blue" variant="outline" onClick={handleSignOut}>Выйти</Button>
        </HStack>
    )
}

export default Header