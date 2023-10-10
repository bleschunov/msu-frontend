import { Container, Flex } from "@chakra-ui/react"
import { FC } from "react"
import { Outlet } from "react-router-dom"
import Footer from "component/Footer"
import Header from "component/Header"

export const AppLayout: FC = () => {
    return (
        <div className="App">
            <Flex direction="column" h="100vh">
                <Header />
                <Container maxW="container.ml" flexGrow="1">
                    <Outlet/>
                </Container>
                <Footer />
            </Flex>
        </div>
    )
}
