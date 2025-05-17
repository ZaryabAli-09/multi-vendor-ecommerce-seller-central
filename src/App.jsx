import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

import { Toaster } from "react-hot-toast";
import Otp from "./pages/Auth/Otp";
import BrandRegistrationSuccessPage from "./pages/Auth/BrandRegistartionSuccessMsg";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import AuthenticatedRoutes from "./components/RoutesWrappers/AuthenticatedRoutes";
import DummyOrder from "./pages/DummyOrder";
import ProductDetail from "./pages/Dashboard/ProductManagement/Product";
import CategoryNavigation from "./categories/CategoryNavigation";
import ProductList from "./categories/ProductList";
import DummyChat from "./pages/Dashboard/Chat/DummyChat";
import Sellers from "./pages/Dashboard/Chat/Sellers";
import SuccessPage from "./pages/DummyOrderSuccess";

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
        <Route path="/create-dummy-order" element={<DummyOrder />} />

        <Route path="/payment-success" element={<SuccessPage />} />

        <Route path="/dummy-chat/:sellerId" element={<DummyChat />} />
        <Route path="/sellers" element={<Sellers />} />

        <Route path="/cc" element={<CategoryNavigation />} />
        <Route
          path="/products/:category/:subcategory?/:subsubcategory?"
          element={<ProductList />}
        />

        {/* Dashboard Routes  */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route
            path="/dashboard/product/:productId"
            element={<ProductDetail />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
