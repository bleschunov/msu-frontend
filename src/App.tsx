import React from 'react';
import {QueryClientProvider} from 'react-query';
import {queryClient} from "./api/client";
import Chat from "./component/Chat";
import {ChakraProvider, Container} from "@chakra-ui/react";

function App() {
  return (
      <ChakraProvider>
          <QueryClientProvider client={queryClient}>
              <div className="App">
                  <Container maxW="3xl">
                      <Chat></Chat>
                  </Container>
              </div>
          </QueryClientProvider>
      </ChakraProvider>
  );
}

export default App;
