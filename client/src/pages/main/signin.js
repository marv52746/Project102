// src/GoogleLoginComponent.js
import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Named import
import { useDispatch } from "react-redux";
import { loggedUserData } from "../../core/services/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../core/services/slices/notificationSlice";

const Signin = () => {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <h2>Login with Google</h2>
      <div id="google-button"></div>
    </div>
  );
};

export default Signin;
