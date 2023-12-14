import React from "react";
import ReactDOM from "react-dom/client";

// import "./styles/index.css";
import "./styles/globals.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Client from "./components/pages/client";
import ServiceEmployee from "./components/pages/serviceEmployee";
import Admin from "./components/pages/admin";
import EditAccount from "./components/pages/EditAccount";
import "./translations/i18n";
import EditTicket from "./components/pages/EditTicket";

import LogIn from "./components/pages/auth/log-in";
// import Register from "./components/pages/auth/register";
import ForgotPassword from "./components/pages/auth/forgot-password";
import CreateTickets from "./components/pages/CreateTicket";
import Tickets from "./components/pages/tickets";
import Machines from "./components/pages/machines";
import Solutions from "./components/pages/solutions";
import Departments from "./components/pages/departments";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  /** AUTH */
  {
    path: "/auth/login",
    element: <LogIn />,
  },
  // {
  //   path: "/auth/register",
  //   element: <Register />,
  // },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />,
  },

  /** OTHER */
  {
    path: "create-ticket",
    element: <CreateTickets />,
  },
  {
    path: "client",
    element: <Client />,
  },
  {
    path: "serviceEmployee",
    element: <ServiceEmployee />,
  },
  {
    path: "admin",
    element: <Admin />,
  },
  {
    path: "edit-account",
    element: <EditAccount />,
  },
  {
    path: "edit-ticket",
    element: <EditTicket />
  },
  {
    path: "tickets",
    element: <Tickets />
  },
  {
    path: "machines",
    element: <Machines />
  },
  {
    path: "solutions",
    element: <Solutions />
  },
  {
    path: "departments",
    element: <Departments />
  }

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
