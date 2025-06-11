import React from "react";
import { Navigate } from "react-router-dom";

// Optional: Validate JWT expiration
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/" replace />;
  }

  // Optional: Role-based protection
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // if (user.role !== "patient") {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default PrivateRoute;
