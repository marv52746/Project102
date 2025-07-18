// src/core/components/Notification.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../services/slices/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { isVisible, message, type } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000); // auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  const colorMap = {
    success: "green",
    error: "red",
    warning: "yellow",
    info: "blue",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-1/2 px-6 py-3 rounded shadow-md text-white text-center bg-${
        colorMap[type] || "blue"
      }-600`}
    >
      {message}
    </div>
  );
};

export default Notification;
