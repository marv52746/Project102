import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loggedUserData } from "../../core/services/slices/userSlice";
import { showNotification } from "../../core/services/slices/notificationSlice";
import { all_routes } from "../../routes/all_routes";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCredentialResponse = (response) => {
    const userObject = jwtDecode(response.credential); // Decode JWT if needed
    const token = response.credential; // This is the JWT token

    // Dispatch action to store user data in Redux and session storage
    dispatch(loggedUserData({ ...userObject, token }));

    dispatch(
      showNotification({
        message: "Login Successfully!",
        type: "success",
      })
    );

    if (token) {
      navigate("/");
    }
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-button"),
          { theme: "outline", size: "large" } // Customize the button
        );
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome back</h1>

        <div className="mb-4">
          <input
            placeholder="Email Address"
            type="email"
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <input
            placeholder="Password"
            type="password"
            name="password"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
        >
          Continue
        </button>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link
              to={all_routes.signup}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="my-6 text-center flex items-center">
          <hr className="flex-grow border-t border-gray-300" />{" "}
          {/* Line on the left */}
          <span className="mx-4 text-gray-500 text-xs">OR</span>
          <hr className="flex-grow border-t border-gray-300" />{" "}
          {/* Line on the right */}
        </div>

        <div id="google-button" className="flex justify-center"></div>
      </div>
    </div>
  );
};

export default Login;
