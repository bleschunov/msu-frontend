import React from 'react';
import {QueryClientProvider} from 'react-query';
import {queryClient} from "./api/client";
import Chat from "./component/Chat";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
          <Chat></Chat>
      </div>
    </QueryClientProvider>
  );
}

export default App;
