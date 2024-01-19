import { ChangeEvent, FC, ReactNode, useState } from "react"
import { Center, Container, FormControl, FormLabel, Grid, Input } from "@chakra-ui/react"
import Cookies from "universal-cookie"
import { signIn } from "api/authApi"

interface IAuth {
    children: ReactNode
}

const Auth: FC<IAuth> = ({ children }) => {
    const cookies = new Cookies()
    const token = cookies.get("token")

    const [emailValue, setEmailValue] = useState<string>("")
    const [passwordValue, setPasswordValue] = useState<string>("")

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmailValue(event.target.value)
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPasswordValue(event.target.value)
    }

    const handleFormSubmit = async (event: any) => {
        event.preventDefault()
        const token = await signIn(emailValue, passwordValue)
        cookies.set("token", token)
    }

    if (!token) {
        return (
            <Grid placeItems="center" h="100vh">
                <Container maxW="lg" flexGrow="1">
                    <Center></Center>
                    <form onSubmit={handleFormSubmit}>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input type="text" value={emailValue} onChange={handleEmailChange} />
                            <Input type="password" value={passwordValue} onChange={handlePasswordChange} />
                            <Input type="submit" />
                        </FormControl>
                    </form>
                </Container>
            </Grid>
        )
    }
    else {
        return (<>{children}</>)
    }
}

export default Auth