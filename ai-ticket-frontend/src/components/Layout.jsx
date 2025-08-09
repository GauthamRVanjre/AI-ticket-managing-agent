import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (_) {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-sky-600 to-cyan-500" />
            <Link
              to="/"
              className="text-sm font-semibold tracking-wide text-neutral-200"
            >
              Atlas Helpdesk
            </Link>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <Link to="/moderator" className="hover:text-white">
              Moderator
            </Link>
            <Link to="/admin" className="hover:text-white">
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
                <span className="truncate max-w-[12rem]">{user.email}</span>
                {user.role && (
                  <span className="badge uppercase">{user.role}</span>
                )}
              </div>
            ) : null}
            <button className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
