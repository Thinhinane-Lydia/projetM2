import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userIsAuthenticated = !!localStorage.getItem("token"); // Vérifie si l'utilisateur est connecté

  return userIsAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
