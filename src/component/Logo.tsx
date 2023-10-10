import { Image } from "@chakra-ui/react"
import { getLogo } from "api/logoApi"
import { useQuery } from "react-query"
import { LOGO_DEFAULT_PATH } from "constant/logoDefaultPath"
import { useContext } from "react"
import { UserContext } from "context/userContext"

const Logo = () => {
    const user = useContext(UserContext)

    const { status: queryStatus } = useQuery<string>("logo", () => getLogo(user?.id), { enabled: !!user.id })

    if (queryStatus === "loading") {
        return <div></div>
    }

    return (
        <Image src={LOGO_DEFAULT_PATH} alt="logo" />
    )
}

export default Logo