import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LockProvider } from "./contexts/LockContext";
import { Provider as JotaiProvider } from "jotai";
import store from "./States/store";
import ToastContainer from "./contexts/ToastContainer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <JotaiProvider store={store}>
      <ToastContainer />
      <LockProvider>
        <App />
      </LockProvider>
    </JotaiProvider>
  </React.StrictMode>
);
