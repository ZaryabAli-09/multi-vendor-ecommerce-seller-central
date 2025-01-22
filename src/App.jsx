import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { Toaster } from "react-hot-toast";
import Otp from "./pages/Otp";
import BrandRegistrationSuccessPage from "./pages/BrandRegistartionSuccessMsg";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        <Route
          path="/brand-registration-success"
          element={<BrandRegistrationSuccessPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
