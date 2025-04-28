import React, { useState } from "react";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

const SupportAndDisputes = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/support&disputes/seller/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ subject, message, fromType: "Seller" }), // or Seller
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(
        data.message || "Your request has been submitted successfully!"
      );

      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Help Center
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Need assistance? Submit your issue or question and our team will get
          back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Briefly describe your issue"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Provide detailed information about your problem"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center transition"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : (
              "Submit Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportAndDisputes;
