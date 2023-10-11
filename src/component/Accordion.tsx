import React, { ReactElement } from "react"
import { Accordion as ChakraAccordion, AccordionButton, AccordionIcon, AccordionItem as ChakraAccordionItem, AccordionPanel, Box } from "@chakra-ui/react"

interface IAccordion {
    titles: string[]
    panels: ReactElement[]
    defaultIndex: number
}

interface IAccordionItem {
    title: string
    panel: ReactElement
}

const Accordion = ({ titles, panels, defaultIndex }: IAccordion) => {
    if (titles.length !== panels.length) {
        throw Error("Length of the title and panels aren't identical in Accordion component")
    }

    const AccordionItem = ({ title, panel }: IAccordionItem) => {
        return (
            <ChakraAccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left' fontWeight="bold">
                            {title}
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    {panel}
                </AccordionPanel>
            </ChakraAccordionItem>
        )
    }

    return (
        <ChakraAccordion defaultIndex={[defaultIndex]} allowMultiple>
            {titles.map((title, i) => <AccordionItem title={title} panel={panels[i]} />)}
        </ChakraAccordion>
    )
}

export default Accordion