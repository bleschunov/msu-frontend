import * as React from "react"
import { NotionRenderer } from "react-notion"
import { FC } from "react"
import { INotionPage } from "component/Faq/types"
import "react-notion/src/styles.css"

const NotionPage: FC<INotionPage> = ({ blockMap }) => {
    return <NotionRenderer
        blockMap={blockMap}
    />
}

export default NotionPage