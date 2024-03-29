import { Box, ChakraProvider } from "@chakra-ui/react"
import queryClient from "api/queryClient"
import { AppLayout } from "component/AppLayout"
import Auth from "component/Auth"
import Chat from "component/Chat"
import EditPromptForm from "component/EditPromptForm"
import { FavoriteMessageContextProvider } from "context/favoriteMessageContext"
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
                                <FavoriteMessageContextProvider>
                                    <Routes >
                                        <Route element={<AppLayout />}>
                                            <Route path="/admin" element={
                                                <Box mt={40}>
                                                    <EditPromptForm />
                                                </Box>
                                            } />
                                            <Route index element={<Chat />} />
                                        </Route>
                                    </Routes>
                                </FavoriteMessageContextProvider>
                            </ModeContextProvider>
                        </UserContextProvider>
                    </Auth>
                </QueryClientProvider>
            </ChakraProvider>
        </BrowserRouter>
    )
}

export default App
