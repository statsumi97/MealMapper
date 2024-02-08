import React from "react";
import App from "./components/App";
import "./index.css";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(routes)
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<RouterProvider router={router} />);
