import React, { FC } from "react"
import "github-markdown-css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownI {
    children: string
}

const Markdown: FC<MarkdownI> = ({ children }) => {
    return (
        <div className='markdown-body'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
    )
}

export default Markdown