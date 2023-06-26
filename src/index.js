import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./context/auth-context";

const root = document.getElementById("root");

const rootReact = createRoot(root);

rootReact.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
