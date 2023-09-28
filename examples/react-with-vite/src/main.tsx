import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { YagnaProvider } from "@golem-sdk/react";
import "./index.css";

if (!import.meta.env.VITE_YAGNA_APP_KEY) {
  throw new Error(
    "VITE_YAGNA_APP_KEY env variable not set. Please specify it in .env file.",
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <YagnaProvider
      config={{
        yagnaAppKey: import.meta.env.VITE_YAGNA_APP_KEY,
      }}
    >
      <App />
    </YagnaProvider>
  </React.StrictMode>,
);
