import { ChakraProvider, Container, Flex } from "@chakra-ui/react"
import queryClient from "api/queryClient"
import Auth from "component/Auth"
import Chat from "component/Chat"
import EditPromptForm from "component/EditPromptForm"
import Footer from "component/Footer"
import Header from "component/Header"
import { ModeContextProvider } from "context/modeContext"
import { UserContextProvider } from "context/userContext"
import { QueryClientProvider } from "react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
    return (
        <BrowserRouter>
            <ChakraProvider>
                <Auth>
                    <QueryClientProvider client={queryClient}>
                        <UserContextProvider>
                            <ModeContextProvider>
                                <div className="App">
                                    <Flex direction="column" h="100vh">
                                        <Header />
                                        <Container maxW="container.md" flexGrow="1">
                                            <Routes>
                                                <Route path="/admin" element={<EditPromptForm />} />
                                                <Route path="/" element={<Chat />} />
                                            </Routes>
                                        </Container>
                                        <Footer />
                                    </Flex>
                                </div>
                            </ModeContextProvider>
                        </UserContextProvider>
                    </QueryClientProvider>
                </Auth>
            </ChakraProvider>
        </BrowserRouter>
    )
}

export default App
