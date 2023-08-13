import {FC, ReactNode, useEffect, useState} from 'react'
import {createClient, Session} from '@supabase/supabase-js'
import {Auth as SupabaseAuth} from '@supabase/auth-ui-react'
import {ThemeSupa} from '@supabase/auth-ui-shared'
import {Container, Grid, Heading} from "@chakra-ui/react";
import {LOGO_TEXT} from "../misc/const";

interface IAuth {
    children: ReactNode
}

const supabase = createClient("https://jkhlwowgrekoqgvfruhq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGx3b3dncmVrb3FndmZydWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NTcwMzQsImV4cCI6MjAwNjAzMzAzNH0.5PLTJ0CaG1n9EdWC-M3B2-p9WK6VCdxTr7eNnPON4oU")

const Auth: FC<IAuth> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return (
            <Grid placeItems="center" h="100vh">
                <Container maxW="lg" flexGrow="1">
                    <Heading textAlign="center">{LOGO_TEXT}</Heading>
                    <SupabaseAuth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            style: {
                                anchor: {display: "none"}
                            }
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