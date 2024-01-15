import { ChangeEvent, FC, ReactNode, useEffect, useState } from 'react'
import { Session, createClient } from "@supabase/supabase-js"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { Button, Center, Container, FormControl, FormLabel, Grid, Input } from '@chakra-ui/react'
import { signIn } from '../api/authApi'
import Cookies from 'universal-cookie'
import { TokenModel } from '../model/TokenModel'

interface IAuth {
    children: ReactNode
}

const supabase = createClient("https://jkhlwowgrekoqgvfruhq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGx3b3dncmVrb3FndmZydWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NTcwMzQsImV4cCI6MjAwNjAzMzAzNH0.5PLTJ0CaG1n9EdWC-M3B2-p9WK6VCdxTr7eNnPON4oU")

const Auth: FC<IAuth> = ({ children }) => {
    const cookies = new Cookies();
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

                    {/*<SupabaseAuth*/}
                    {/*    supabaseClient={supabase}*/}
                    {/*    appearance={{*/}
                    {/*        theme: ThemeSupa,*/}
                    {/*        style: {*/}
                    {/*            anchor: { display: "none" }*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*    localization={{*/}
                    {/*        variables: {*/}
                    {/*            sign_in: {*/}
                    {/*                email_label: "Почта",*/}
                    {/*                password_label: "Пароль",*/}
                    {/*                email_input_placeholder: "",*/}
                    {/*                password_input_placeholder: "",*/}
                    {/*                button_label: "Войти",*/}
                    {/*                loading_button_label: "Пожалуйста, подождите...",*/}
                    {/*            },*/}
                    {/*        },*/}
                    {/*    }}*/}
                    {/*    providers={[]}*/}
                    {/*/>*/}
                </Container>
            </Grid>
        )
    }
    else {
        return (<>{children}</>)
    }
}

export default Auth