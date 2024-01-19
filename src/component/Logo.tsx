import { Image } from "@chakra-ui/react"
import { getHostPath } from "misc/util"

const getLogoPath = (): string => {
    const host = getHostPath()
    return `${host}/logo/logo.svg`
}

const Logo = () => {
    return (
        <Image src={getLogoPath()} alt="logo" />
    )
}

export default Logo