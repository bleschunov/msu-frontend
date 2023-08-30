import { FC, ReactNode, createContext } from "react"
import { useQuery } from "react-query"
import { User } from "@supabase/supabase-js"
import { Grid, Spinner } from "@chakra-ui/react"
import { getUser } from "api/supabase"

const UserContext = createContext<User>({} as User)

interface UserContextProviderProps {
    children: ReactNode
}

const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
    const { data: user, isSuccess } = useQuery<User>("user", getUser, {
        cacheTime: 0
    })

    if (!user || !isSuccess) {
        return (
            <Grid h="100vh" w="100vw" placeItems="center">
                <Spinner />
            </Grid>
        )
    }

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export {
    UserContextProvider,
    UserContext
}