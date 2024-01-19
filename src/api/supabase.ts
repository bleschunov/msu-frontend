import { createClient } from "@supabase/supabase-js"
import Cookies from "universal-cookie"

const supabase = createClient(
    "https://jkhlwowgrekoqgvfruhq.supabase.co",
    // Это АПИ ключ из supabase, который можно палить. Есть ещё другой ключ, который палить нельзя
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpraGx3b3dncmVrb3FndmZydWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA0NTcwMzQsImV4cCI6MjAwNjAzMzAzNH0.5PLTJ0CaG1n9EdWC-M3B2-p9WK6VCdxTr7eNnPON4oU"
)

const signOut = async () => {
    // await supabase.auth.signOut()
    const cookies = new Cookies()
    cookies.remove("token")
}

export {
    supabase,
    signOut,
}
