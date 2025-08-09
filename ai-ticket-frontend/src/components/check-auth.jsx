import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckAuth = ({ children, protectedRoute }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (protectedRoute) {
      if (token === null) {
        console.log("no token");
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      if (token) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, [navigate, protectedRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return children;
};

export default CheckAuth;
