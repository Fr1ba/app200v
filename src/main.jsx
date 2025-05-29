/**
 * main.jsx
 *
 * The entry point of the React application. This file is responsible for rendering the root
 * React component (`App`) into the DOM. It wraps the application with `StrictMode` for highlighting
 * potential problems and `BrowserRouter` for handling client-side routing.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);