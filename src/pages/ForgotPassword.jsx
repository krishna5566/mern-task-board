import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetPath, setResetPath] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgotPassword", { email });
      toast.success("Reset link sent!");
      setResetPath(res.data.data); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  const handleRedirectToReset = () => {
    const fullResetURL = `${window.location.origin}${resetPath}`;
    window.location.href = fullResetURL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleForgot} className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-purple-600 w-full p-2 rounded hover:bg-purple-700 text-black">
          Generate Reset Link
        </button>

        {resetPath && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleRedirectToReset}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-black mt-2"
            >
              Open Reset Password Page
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
