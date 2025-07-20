import React from "react";
import { Routes, Route } from "react-router-dom";
import Toast from "./assets/components/ui/Toast";
import Login from "./assets/pages/auth/Login";
import Register from "./assets/pages/auth/Register";
import ForgotPassword from "./assets/pages/auth/ForgotPassword";
import ResetPassword from "./assets/pages/auth/ResetPassword";
import VerifyEmail from "./assets/pages/auth/VerifyEmail";
import Home from "./assets/pages/public/Home";
import ProtectedRoute from "./assets/components/ui/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token?" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
