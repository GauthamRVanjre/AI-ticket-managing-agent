import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/check-auth";
import Layout from "./components/Layout";
import "./index.css";
import Admin from "./pages/admin";
import CreateTicket from "./pages/create-ticket";
import Login from "./pages/login";
import Moderator from "./pages/moderator";
import MyTickets from "./pages/my-tickets";
import SignUp from "./pages/signup";
import TicketDetailsPage from "./pages/ticket";
import Tickets from "./pages/tickets";

// Component to redirect based on user role
function RoleBasedRedirect() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (_) {
      return null;
    }
  })();

  if (!user) return <Tickets />;

  switch (user.role) {
    case "user":
      return <MyTickets />;
    case "moderator":
      return <Moderator />;
    case "admin":
      return <Admin />;
    default:
      return <Tickets />;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <RoleBasedRedirect />
              </Layout>
            </CheckAuth>
          }
        />

        {/* User Routes */}
        <Route
          path="/create-ticket"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <CreateTicket />
              </Layout>
            </CheckAuth>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <MyTickets />
              </Layout>
            </CheckAuth>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <TicketDetailsPage />
              </Layout>
            </CheckAuth>
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <CheckAuth protectedRoute={false}>
              <Login />
            </CheckAuth>
          }
        />

        <Route
          path="/signUp"
          element={
            <CheckAuth protectedRoute={false}>
              <SignUp />
            </CheckAuth>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Admin />
              </Layout>
            </CheckAuth>
          }
        />

        <Route
          path="/admin/users"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Admin />
              </Layout>
            </CheckAuth>
          }
        />

        <Route
          path="/admin/tickets"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Admin />
              </Layout>
            </CheckAuth>
          }
        />

        {/* Moderator Routes */}
        <Route
          path="/moderator"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Moderator />
              </Layout>
            </CheckAuth>
          }
        />

        {/* Legacy route for backward compatibility */}
        <Route
          path="/tickets"
          element={
            <CheckAuth protectedRoute={true}>
              <Layout>
                <Tickets />
              </Layout>
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
