import React from "react";
import clsx from "clsx";

function StatCard({ icon: Icon, title, value, percentage, trend, color }) {
  return (
    <div className="flex items-center bg-white shadow-lg p-6 rounded-lg">
      {/* Left (Icon) */}
      <div className="w-[35%] flex justify-center">
        <div
          className={clsx(
            "w-16 h-16 flex items-center justify-center border-2 p-4 rounded-full mr-4"
          )}
          style={{ borderColor: color }}
        >
          <Icon size={40} style={{ color: color }} />
        </div>
      </div>

      {/* Right (Text) */}
      <div className="w-[65%]">
        <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
        <span className="text-3xl font-bold" style={{ color: color }}>
          {value}
        </span>
        <p className="mt-2 text-sm text-gray-500">
          <span
            className="font-semibold"
            style={{ color: trend === "up" ? color : "red" }}
          >
            {percentage}
          </span>{" "}
          {trend === "up" ? "Increased" : "Decreased"}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
