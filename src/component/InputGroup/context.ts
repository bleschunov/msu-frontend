import { createContext } from "react"
import { IInputGroupContext } from "component/InputGroup/types"

const InputGroupContext =
    createContext<IInputGroupContext>({} as IInputGroupContext)

export default InputGroupContext