import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { YagnaProvider } from "@golem-sdk/react";
import "@fontsource/kanit/400.css"; // regular
import "@fontsource/kanit/600.css"; // semi-bold
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <YagnaProvider>
      <App />
      <ToastContainer
        hideProgressBar
        position="top-center"
        stacked
        autoClose={2500}
      />
    </YagnaProvider>
  </React.StrictMode>,
);
