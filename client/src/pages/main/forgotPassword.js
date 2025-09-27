import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showNotification } from "../../core/services/slices/notificationSlice";
import apiService from "../../core/services/apiService";
import { all_routes } from "../../routes/all_routes";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post(dispatch, "auth/forgot-password", { email });
      dispatch(
        showNotification({
          message: "Password reset sent to your email.",
          type: "success",
        })
      );
      navigate("/");
    } catch (err) {
      console.error("Forgot password error", err);
      dispatch(
        showNotification({
          message: "Error sending reset link",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Remembered your password?{" "}
          <Link to={all_routes.login} className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
