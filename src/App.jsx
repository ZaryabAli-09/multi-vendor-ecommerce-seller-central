import { Routes, Route } from "react-router-dom";

import React from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { Toaster } from "react-hot-toast";
import Otp from "./pages/Otp";
import BrandRegistrationSuccessPage from "./pages/BrandRegistartionSuccessMsg";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardHome from "./pages/Dashboard/DashboardHome";

const App = () => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/brand-registration-success"
          element={<BrandRegistrationSuccessPage />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardHome />} />
      </Routes>
    </>
  );
};

export default App;
