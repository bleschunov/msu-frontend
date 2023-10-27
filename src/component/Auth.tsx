import { FC, ReactNode, useEffect, useState } from "react"
import { Session, createClient } from "@supabase/supabase-js"
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { Center, Container, Grid } from "@chakra-ui/react"
import { create_tenant_with_user_id } from "api/tenantApi"
import { useSearchQuery } from "misc/util"
import { USER_REGISTRATION } from "constant/userRegistration"

interface IAuth {
    children: ReactNode
}

const supabase = createClient("https://jkhlwowgrekoqgvfruhq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGx3b3dncmVrb3FndmZydWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NTcwMzQsImV4cCI6MjAwNjAzMzAzNH0.5PLTJ0CaG1n9EdWC-M3B2-p9WK6VCdxTr7eNnPON4oU")

const Auth: FC<IAuth> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null)
    const query = useSearchQuery()
    const isRegistrationEnabled = String(query.get(USER_REGISTRATION)).toLowerCase() === "true"

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (isRegistrationEnabled)
                    if(session)
                        await create_tenant_with_user_id(session.user.id)
                setSession(session)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return (
            <Grid placeItems="center" h="100vh">
                <Container maxW="lg" flexGrow="1">
                    <Center></Center>
                    <SupabaseAuth
                        supabaseClient={supabase}
                        view={isRegistrationEnabled ? "sign_up" : "sign_in"}
                        showLinks={isRegistrationEnabled}
                        appearance={{
                            theme: ThemeSupa,
                        }}
                        
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: "Почта",
                                    password_label: "Пароль",
                                    email_input_placeholder: "",
                                    password_input_placeholder: "",
                                    button_label: "Войти",
                                    loading_button_label: "Пожалуйста, подождите...",
                                    link_text: "Уже есть аккаунт? Войдите"
                                },
                                sign_up: {
                                    email_label: "Почта",
                                    password_label: "Пароль",
                                    email_input_placeholder: "",
                                    password_input_placeholder: "",
                                    button_label: "Зарегистрироваться",
                                    loading_button_label: "Пожалуйста, подождите...",
                                    link_text: "Нет аккаунта? Зарегистрируйтесь"
                                },
                                forgotten_password: {
                                    link_text: ""
                                }
                            },
                        }}
                        providers={[]}
                    />
                </Container>
            </Grid>
        )
    }
    else {
        return (<>{children}</>)
    }
}

export default Auth