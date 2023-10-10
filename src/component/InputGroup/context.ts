import { createContext } from 'react'
import { IInputGroupContext } from './types'

const InputGroupContext =
    createContext<IInputGroupContext>({} as IInputGroupContext)

export default InputGroupContext