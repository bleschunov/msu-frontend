import React from "react"
import { QueryClientProvider } from "react-query"
import { ChakraProvider, Container, Flex } from "@chakra-ui/react"
import Chat from "component/Chat"
import Header from "component/Header"
import Footer from "component/Footer"
import Auth from "component/Auth"
import queryClient from "api/queryClient"
import { UserContextProvider } from "context/userContext"
import { ModeContextProvider } from "context/modeContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import EditPromptForm from "component/EditPromptForm"

function App() {
    return (
        <ChakraProvider>
            <Auth>
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <ModeContextProvider>
                            <BrowserRouter>
                                <div className="App">
                                    <Flex direction="column" h="100vh">
                                        <Header />
                                        <Container maxW="3xl" flexGrow="1">
                                            <Routes>
                                                <Route path="/admin" element={<EditPromptForm />} />
                                                <Route path="/" element={<Chat />} />
                                            </Routes>
                                        </Container>
                                        <Footer />
                                    </Flex>
                                </div>
                            </BrowserRouter>
                        </ModeContextProvider>
                    </UserContextProvider>
                </QueryClientProvider>
            </Auth>
        </ChakraProvider>
    )
}

export default App
