import { createContext } from 'react'
import { IFileRowContext } from './types'

const FileRowContext = createContext<IFileRowContext>({} as IFileRowContext)

export default FileRowContext