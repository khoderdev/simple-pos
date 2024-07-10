/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LockProvider } from "./contexts/LockContext";
import { Provider as JotaiProvider } from "jotai";
import JStore from "./States/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import localforage from "localforage";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import {thunk} from "redux-thunk";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import reducers from "./store/reducers/";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

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
  persistClient: async (client: unknown) => {
    await localforage.setItem("react-query", client);
  },
  restoreClient: async () => {
    return await localforage.getItem("react-query");
  },
  removeClient: async () => {
    await localforage.removeItem("react-query");
  },
};

persistQueryClient({
  queryClient,
  persister: localForagePersistor,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["updateLanguage"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const Store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const persistor = persistStore(Store);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider store={JStore}>
            <LockProvider>
              <HashRouter>
                <App />
              </HashRouter>
            </LockProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
    ,
  </React.StrictMode>
);
