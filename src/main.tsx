import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Nie znaleziono elementu #root.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
