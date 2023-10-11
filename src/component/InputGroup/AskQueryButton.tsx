import { useContext, MouseEvent } from "react"
import { Button } from "@chakra-ui/react"
import { IInputGroupContext } from "component/InputGroup/types"
import InputGroupContext from "component/InputGroup/context"

interface IAskQueryButton {
    query: string
}

const AskQueryButton = ({ query }: IAskQueryButton) => {
    const { handleSubmit } = useContext<IInputGroupContext>(InputGroupContext)

    const handleClick = (_: MouseEvent<HTMLButtonElement>) => {
        handleSubmit(query)
    }

    return (
        <Button
            w="full"
            h="full"
            pt="10px"
            justifyContent="flex-start"
            alignItems="start"
            textAlign="left"
            whiteSpace="initial"
            onClick={handleClick}
        >
            {query}
        </Button>
    )
}

export default AskQueryButton