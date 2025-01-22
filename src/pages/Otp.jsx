import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OTPPage = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const navigate = useNavigate();
  const handleChange = (value, index) => {
    if (isNaN(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus the next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        // Move to the previous input if current input is empty
        document.getElementById(`otp-input-${index - 1}`).focus();
      } else {
        // Clear the current input
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.includes("")) {
      setErrorMessage("Please enter all OTP fields.");
      return;
    }
    try {
      const res = await fetch(
        "https://ecom-backend-5l3d.onrender.com/api/seller/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ verificationOtp: otp.join("") }),
        }
      );

      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        throw Error(result.message);
      }

      toast.success(result.message);
      navigate("/brand-registration-success", {
        state: { message: result.message },
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Enter OTP
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We've sent a code to your email
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-4">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-12 text-xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
