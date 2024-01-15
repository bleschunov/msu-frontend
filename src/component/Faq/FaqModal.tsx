import {
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
} from "@chakra-ui/react"
import { FaQuestion } from "react-icons/fa6"
import { useContext } from "react"
import { useQuery } from "react-query"
import { BlockMapType } from "react-notion"
import NotionPage from "component/Faq/NotionPage"
import { getInstruction } from "api/instructionApi"
import { UserContext } from "context/userContext"

export function FaqModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useContext(UserContext)

    const { data: blockMap } = useQuery<BlockMapType>("getInstruction", () => getInstruction(user.tenants[0].id))

    return (
        <>
            <IconButton 
                aria-label="question-button"
                icon={<FaQuestion color="black" />}
                isRound = {true}
                onClick={onOpen}
            />    
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {blockMap ? <NotionPage blockMap={blockMap} /> : <Spinner />}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}