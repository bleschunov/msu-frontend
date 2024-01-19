import axios from "axios"
import { TokenModel } from "model/TokenModel"
import { getBaseUrl } from "misc/util"

const signIn = async (username: string, password: string): Promise<TokenModel> => {
    const { data: tokenModel } = await axios.post(
        `${getBaseUrl()}/auth/sign_in`,
        { username, password },
        {
            "headers": { "content-type": "application/x-www-form-urlencoded" }
        }
    )
    return tokenModel
}

export {
    signIn
}
