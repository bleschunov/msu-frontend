import { Box, ChakraProvider } from "@chakra-ui/react"
import queryClient from "api/queryClient"
import { AppLayout } from "component/AppLayout"
import Auth from "component/Auth"
import Chat from "component/Chat"
import EditPromptForm from "component/EditPromptForm"
import { ModeContextProvider } from "context/modeContext"
import { UserContextProvider } from "context/userContext"
import { QueryClientProvider } from "react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
    return (
        <BrowserRouter>
            <ChakraProvider>
                <QueryClientProvider client={queryClient}>
                    <Auth>
                        <UserContextProvider>
                            <ModeContextProvider>
                                <Routes >
                                    <Route element={<AppLayout/>}>
                                        <Route path="/admin" element={
                                            <Box mt={40}>
                                                <EditPromptForm />
                                            </Box>
                                        } />
                                        <Route path="/" element={<Chat />} />
                                        {/* <Route path="/" element={} /> */}
                                    </Route>
                                </Routes>
                            </ModeContextProvider>
                        </UserContextProvider>
                    </Auth>
                </QueryClientProvider>
            </ChakraProvider>
        </BrowserRouter>
    )
}

export default App
