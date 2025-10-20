// src/core/components/Notification.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "../services/slices/notificationSlice";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
  success: <CheckCircle className="text-green-600 w-5 h-5" />,
  error: <XCircle className="text-red-600 w-5 h-5" />,
  warning: <AlertTriangle className="text-yellow-600 w-5 h-5" />,
  info: <Info className="text-blue-600 w-5 h-5" />,
};

const bgMap = {
  success: "bg-green-50 border-green-500",
  error: "bg-red-50 border-red-500",
  warning: "bg-yellow-50 border-yellow-500",
  info: "bg-blue-50 border-blue-500",
};

const textMap = {
  success: "text-green-800",
  error: "text-red-800",
  warning: "text-yellow-800",
  info: "text-blue-800",
};

export default function Notification() {
  const dispatch = useDispatch();
  const { isVisible, message, type } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-[9999] px-4 py-6 pointer-events-none">
      <div
        className={`w-full max-w-md rounded-lg shadow-lg border px-4 py-3 flex items-start gap-3 transition-all duration-300 ease-out
        ${bgMap[type] || bgMap.info} ${
          textMap[type] || textMap.info
        } animate-slideInDown pointer-events-auto`}
      >
        <div className="mt-1">{iconMap[type] || iconMap.info}</div>
        <div className="flex-1 text-sm">{message}</div>
        <button
          onClick={() => dispatch(hideNotification())}
          className="text-gray-500 hover:text-gray-800 mt-1"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
