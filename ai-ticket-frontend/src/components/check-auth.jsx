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
    return <div>Loading...</div>;
  }

  return children;
};

export default CheckAuth;
