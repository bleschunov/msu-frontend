import React, { FC } from "react"
import "github-markdown-css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { IMarkdown } from './types'

const Markdown: FC<IMarkdown> = ({ children }) => {
    return (
        <div className='markdown-body'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
    )
}

export default Markdown