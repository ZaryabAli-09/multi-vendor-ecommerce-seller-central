import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
