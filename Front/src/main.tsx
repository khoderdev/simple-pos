// import React from "react";
// import ReactDOM from "react-dom/client";
// import "./index.css";
// import App from "./App";
// import { LockProvider } from "./contexts/LockContext";
// import { Provider as JotaiProvider } from "jotai";
// import store from "./States/store";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { persistQueryClient } from '@tanstack/react-query-persist-client';
// import { experimental_createPersister } from '@tanstack/query-persist-client-core'

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5, // 5 minutes
//       cacheTime: 1000 * 60 * 30, // 30 minutes
//       retry: 2,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// const localStoragePersistor = experimental_createPersister({ storage: window.localStorage });

// persistQueryClient({
//   queryClient,
//   persister: localStoragePersistor,
// });

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <JotaiProvider store={store}>
//         <LockProvider>
//           <App />
//         </LockProvider>
//       </JotaiProvider>
//     </QueryClientProvider>
//   </React.StrictMode>
// );


// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LockProvider } from "./contexts/LockContext";
import { Provider as JotaiProvider } from "jotai";
import store from "./States/store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import localforage from "localforage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const localForagePersistor = {
  persistClient: async (client) => {
    await localforage.setItem("react-query", client);
  },
  restoreClient: async () => {
    return await localforage.getItem("react-query");
  },
  removeClient: async () => {
    await localforage.removeItem("react-query");
  }
};

persistQueryClient({
  queryClient,
  persister: localForagePersistor,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={store}>
        <LockProvider>
          <App />
        </LockProvider>
      </JotaiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
