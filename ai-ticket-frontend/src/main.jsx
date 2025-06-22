import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/check-auth";
import Tickets from "./pages/tickets";
import Ticket from "./pages/ticket";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Admin from "./pages/admin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protected={true}>
              <Tickets />
            </CheckAuth>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protected={true}>
              <Ticket />
            </CheckAuth>
          }
        />

        <Route
          path="/login"
          element={
            <CheckAuth protected={false}>
              <Login />
            </CheckAuth>
          }
        />

        <Route
          path="/signUp"
          element={
            <CheckAuth protected={false}>
              <SignUp />
            </CheckAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <CheckAuth protected={true}>
              <Admin />
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
