import React from "react";

const DiagramItem = ({
  title,
  role,
  phone,
  email,
  avatar,
  onToggle,
  isCollapsed,
  position,
}) => {
  return (
    <div className="relative w-[330px] h-[120px] bg-white border border-gray-300 rounded-lg shadow-md">
      {/* Person box with avatar and details */}
      <div className="flex items-center p-4">
        <div
          className="w-[60px] h-[60px] bg-cover bg-center rounded-full"
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
        <div className="ml-4">
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-gray-600">{role}</div>

          {/* Collapsible content */}
          {!isCollapsed && (
            <>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mdi mdi-cellphone-android mr-2"></span>
                <span>{phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mdi mdi-email-outline mr-2"></span>
                <span>
                  <a className="text-blue-500" href={`mailto:${email}`}>
                    {email}
                  </a>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <div className="absolute top-2 right-2 cursor-pointer" onClick={onToggle}>
        <div
          className={`w-6 h-6 flex items-center justify-center rounded-full ${
            isCollapsed ? "bg-gray-500" : "bg-teal-500"
          }`}
        >
          <i className={`mdi ${isCollapsed ? "mdi-plus" : "mdi-minus"}`}></i>
        </div>
      </div>

      {/* Line to another DiagramItem */}
      {position && (
        <div
          className="absolute left-1/2 top-full transform -translate-x-1/2"
          style={{
            height: "20px",
            width: "2px",
            backgroundColor: "#000",
          }}
        ></div>
      )}
    </div>
  );
};

export default DiagramItem;
