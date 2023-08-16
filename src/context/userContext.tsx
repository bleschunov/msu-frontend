import {createContext, FC, ReactNode} from "react";
import {useQuery} from "react-query";
import {getUser} from "../api/supabase";
import {User} from "@supabase/supabase-js";
import {Grid, Spinner} from "@chakra-ui/react";

const UserContext = createContext<User>({} as User)

interface UserContextProviderProps {
    children: ReactNode
}

const UserContextProvider: FC<UserContextProviderProps> = ({children}) => {
    const {data: user, isSuccess} = useQuery<User>("user", getUser, {
        cacheTime: 0
    })

    if (!user || !isSuccess) {
        return (
            <Grid placeItems="center">
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