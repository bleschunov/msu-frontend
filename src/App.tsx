import React from "react"
import { QueryClientProvider } from "react-query"
import { ChakraProvider, Container, Flex } from "@chakra-ui/react"
import Chat from "component/Chat"
import Header from "component/Header"
import Footer from "component/Footer"
import Auth from "component/Auth"
import queryClient from "api/queryClient"
import { UserContextProvider } from "context/userContext"
import { BrowserRouter } from "react-router-dom"

function App() {
    return (
        <ChakraProvider>
            <Auth>
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <BrowserRouter>
                            <div className="App">
                                <Flex direction="column" h="100vh">
                                    <Header />
                                    <Container maxW="3xl" flexGrow="1">
                                        <Chat></Chat>
                                    </Container>
                                    <Footer />
                                </Flex>
                            </div>
                        </BrowserRouter>
                    </UserContextProvider>
                </QueryClientProvider>
            </Auth>
        </ChakraProvider>
    )
}

export default App
