import React from "react";
import App from "./components/App";
import "./index.css";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

const router = createBrowserRouter(routes)
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
    <UserProvider>
<RouterProvider router={router} />
    </UserProvider>
);
