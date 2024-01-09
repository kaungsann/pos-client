import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function GuardRouter({ children }) {
  const userData = useSelector((state) => state.loginData);

  if (userData) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default GuardRouter;
