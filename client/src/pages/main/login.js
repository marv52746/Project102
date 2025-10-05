import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loggedUserData } from "../../core/services/slices/userSlice";
import { showNotification } from "../../core/services/slices/notificationSlice";
import { all_routes } from "../../routes/all_routes";
import apiService from "../../core/services/apiService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Hide logo on certain routes
  const hideLogoRoutes = ["/", "/dashboard"];
  const shouldHideLogo = hideLogoRoutes.includes(location.pathname);

  const handleCredentialResponse = async (response) => {
    try {
      const googleToken = response.credential;

      // Send to backend for verification + app token generation
      const backendResponse = await apiService.post(dispatch, "auth/google", {
        token: googleToken,
      });

      const appToken = backendResponse.token;
      localStorage.setItem("token", appToken); // 👈 Save token
      const userObject = jwtDecode(appToken); // This now contains app role, etc.

      dispatch(loggedUserData({ ...userObject, token: appToken }));

      dispatch(
        showNotification({
          message: "Login Successfully!",
          type: "success",
        })
      );

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Google login failed", err);
      dispatch(
        showNotification({
          message: "Google login failed",
          type: "error",
        })
      );
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
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.post(dispatch, "auth/login", {
        email,
        password,
      });

      const token = response.token;
      const userObject = jwtDecode(token);

      // 👇 Save token for interceptor
      localStorage.setItem("token", token);

      if (userObject.must_change_password) {
        // 👇 redirect to reset-password page
        navigate(all_routes.forcePasswordChange);
        dispatch(
          showNotification({
            message: "Set new password!",
            type: "warning",
          })
        );
        return; //
      } else {
        dispatch(loggedUserData({ ...userObject, token }));

        dispatch(
          showNotification({
            message: "Login Successfully!",
            type: "success",
          })
        );
        navigate("/");
        window.location.reload();
      }

      // window.location.reload();
    } catch (err) {
      console.error("Login failed", err);
      // Error is already handled in apiService with showNotification
      dispatch(
        showNotification({
          message: "Login failed",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* ✅ Clickable Logo (hidden on certain routes) */}
        {!shouldHideLogo && (
          <Link
            to="/"
            className="flex flex-col items-center space-x-3 mb-8 hover:opacity-90"
          >
            <img
              src="/assets/images/Logo.png"
              alt="Logo"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-md font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
              Bislig Premier Birthing Home
            </h1>
          </Link>
        )}

        <h1 className="text-3xl font-bold mb-6 text-center">Welcome back</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              placeholder="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base text-gray-700 
             bg-white outline-none 
             focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 
             transition-all duration-150"
            />
          </div>

          <div className="mb-6 relative ">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base text-gray-700 
             bg-white outline-none 
             focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 
             transition-all duration-150"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
            </button>
          </div>

          <div className="text-right mb-6">
            <Link
              to={all_routes.forgotPassword}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            Continue
          </button>
        </form>
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
