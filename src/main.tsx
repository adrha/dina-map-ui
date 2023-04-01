import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

axios.interceptors.request.use((config) => {
  config.baseURL = "https://open-participation-platform-api.azurewebsites.net/api/";
  return config;
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
