import {createClient, User} from "@supabase/supabase-js";

const supabase = createClient(
    "https://jkhlwowgrekoqgvfruhq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGx3b3dncmVrb3FndmZydWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NTcwMzQsImV4cCI6MjAwNjAzMzAzNH0.5PLTJ0CaG1n9EdWC-M3B2-p9WK6VCdxTr7eNnPON4oU"
)

const signOut = async () => {
    await supabase.auth.signOut()
}

const getUser = async (): Promise<User> => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw Error("User does not find")
    }

    return user
}

export {
    supabase,
    signOut,
    getUser,
}
