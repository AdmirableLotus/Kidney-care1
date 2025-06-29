import React from "react";
import { Navigate } from "react-router-dom";

// Safely decode JWT payload
const getTokenPayload = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

// Check if token is valid and optionally if user has an allowed role
const isTokenValid = (token, allowedRoles = []) => {
  const payload = getTokenPayload(token);
  if (!payload || payload.exp * 1000 <= Date.now()) return false;

  if (allowedRoles.length > 0) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return allowedRoles.includes(user.role);
  }

  return true;
};

const PrivateRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid(token, roles)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
