import React from "react";

const Reloader = ({
  text = "Loading...",
  size = 8,
  color = "blue-500",
  height = "h-64",
}) => {
  return (
    <div className={`flex justify-center items-center ${height} text-gray-600`}>
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-${color}`}
      ></div>
      <span className="ml-3">{text}</span>
    </div>
  );
};

export default Reloader;
