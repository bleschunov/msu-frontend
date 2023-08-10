import React from 'react';
import {QueryClientProvider} from 'react-query';
import {queryClient} from "./api/client";
import Chat from "./component/Chat";
import {ChakraProvider, Container, Flex} from "@chakra-ui/react";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Auth from "./component/Auth";

function App() {
  return (
      <ChakraProvider>
          <Auth>
              <QueryClientProvider client={queryClient}>
                  <div className="App">
                      <Flex direction="column" h="100vh">
                          <Header />
                          <Container maxW="3xl" flexGrow="1">
                              <Chat></Chat>
                          </Container>
                          <Footer />
                      </Flex>
                  </div>
              </QueryClientProvider>
          </Auth>
      </ChakraProvider>
  );
}

export default App;
