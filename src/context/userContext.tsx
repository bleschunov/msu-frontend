import { FC, ReactNode, createContext } from "react"
import { useQuery } from "react-query"
import { Grid, Spinner } from "@chakra-ui/react"
import { getCurrentUser } from "api/userApi"
import { UserModel } from "model/UserModel"
import { signOut } from "api/supabase"

const UserContext = createContext<UserModel>({} as UserModel)

interface UserContextProviderProps {
    children: ReactNode
}

const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
    const { data: user, isSuccess } = useQuery<UserModel>("user", getCurrentUser, {
        onError: (error) => {
            // @ts-ignore
            if (error.response?.status === 404) {
                signOut()
                throw Error("User is not found or user is not under any tenant.")
            }

            signOut()
        },
        cacheTime: 0,
        retry: false
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