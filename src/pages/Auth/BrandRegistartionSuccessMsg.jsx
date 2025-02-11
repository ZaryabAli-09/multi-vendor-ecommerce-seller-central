import React from "react";
import { useLocation } from "react-router-dom";

const BrandRegistrationSuccessPage = () => {
  const location = useLocation(); // Access the passed state
  const message = location.state?.message || "Registration Successful!";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
        <p className="text-gray-800">{message}</p>
        <button
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => (window.location.href = "/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default BrandRegistrationSuccessPage;
