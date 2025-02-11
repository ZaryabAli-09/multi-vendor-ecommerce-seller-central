import { Routes, Route } from "react-router-dom";

import React from "react";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

import { Toaster } from "react-hot-toast";
import Otp from "./pages/Auth/Otp";
import BrandRegistrationSuccessPage from "./pages/Auth/BrandRegistartionSuccessMsg";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Product from "./pages/Dashboard/ProductManagement/Product";
import AuthenticatedRoutes from "./components/RoutesWrappers/AuthenticatedRoutes";

const App = () => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Routes>
        {/* Auth Routes  */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/brand-registration-success"
          element={<BrandRegistrationSuccessPage />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard Routes  */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/product/:productId" element={<Product />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
