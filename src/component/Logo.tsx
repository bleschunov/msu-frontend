import { Image } from "@chakra-ui/react"
import { LOGO_DEFAULT_PATH } from "constant/logoDefaultPath"
import { useContext } from "react"
import { UserContext } from "context/userContext"

const Logo = () => {
    const user = useContext(UserContext)

    const getLogoPath = () => {
        if (user.tenants[0].logo) {
            return user.tenants[0].logo
        }
        return LOGO_DEFAULT_PATH
    }

    return ( 
        <Image src={getLogoPath()} alt="logo" />
    )
}

export default Logo