import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../../routes/all_routes";
import { useDispatch } from "react-redux";
import { loggedUserData } from "../../core/services/slices/userSlice";
import { showNotification } from "../../core/services/slices/notificationSlice";
import apiService from "../../core/services/apiService";
import { jwtDecode } from "jwt-decode";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Hide logo on certain routes
  const hideLogoRoutes = ["/", "/dashboard"];
  const shouldHideLogo = hideLogoRoutes.includes(location.pathname);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordcheck] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      dispatch(
        showNotification({
          message: "Passwords do not match",
          type: "error",
        })
      );
      return;
    }

    try {
      const response = await apiService.post(dispatch, "auth/signup", {
        email,
        password,
      });

      const token = response.token;
      const userObject = jwtDecode(token);

      dispatch(loggedUserData({ ...userObject, token }));
      dispatch(
        showNotification({
          message: "Account created successfully!",
          type: "success",
        })
      );

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const googleToken = response.credential;
      const apiRes = await apiService.post(dispatch, "auth/google", {
        token: googleToken,
      });

      const appToken = apiRes.token;
      const userObject = jwtDecode(appToken);

      dispatch(loggedUserData({ ...userObject, token: appToken }));
      dispatch(
        showNotification({
          message: "Signed up with Google successfully!",
          type: "success",
        })
      );

      const allowedRoles = ["admin", "doctor", "staff", "owner"];
      if (allowedRoles.includes(userObject.role)) {
        navigate("/dashboard");
      } else {
        navigate("/portal");
      }
    } catch (err) {
      console.error("Google signup failed", err);
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
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-button"),
          { theme: "outline", size: "large" }
        );
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create your account
        </h1>

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base text-gray-700 
             bg-white outline-none 
             focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 
             transition-all duration-150"
            />
          </div>

          <div className="mb-4 relative">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
            </button>
          </div>

          <div className="mb-6 relative">
            <input
              placeholder="Confirm Password"
              type={showPasswordCheck ? "text" : "password"}
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base text-gray-700 
             bg-white outline-none 
             focus-visible:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-300 
             transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPasswordcheck(!showPasswordCheck)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPasswordCheck ? <EyeOff size={25} /> : <Eye size={25} />}
            </button>
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
            Already have an account?{" "}
            <Link
              to={all_routes.login}
              className="text-blue-500 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="my-6 text-center flex items-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-xs">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div id="google-signup-button" className="flex justify-center"></div>
      </div>
    </div>
  );
};

export default SignUp;
