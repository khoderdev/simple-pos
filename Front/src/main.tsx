import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LockProvider } from "./contexts/LockContext";
import { Provider as JotaiProvider } from "jotai";
import store from "./States/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <JotaiProvider store={store}>
      <LockProvider>
        <App />
      </LockProvider>
    </JotaiProvider>
  </React.StrictMode>
);
