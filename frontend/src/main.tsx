import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { api } from "./lib/api";

// Render's free tier puts the backend to sleep when idle. Waking it as soon as the site opens
// means it is already starting while the visitor reads the first screen. The result is not needed.
api.get("/ping").catch(() => undefined);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
