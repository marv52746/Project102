import React from "react";

export const renderSpacer = (field, index) => {
  if (field.type === "spacer") {
    return (
      <div key={index} className="col-span-2 h-0 sm:h-4" aria-hidden="true" />
    );
  }
  if (field.type === "half-spacer") {
    return <div key={index} className="col-span-1" />;
  }
  if (field.type === "label") {
    return (
      <div key={index} className="col-span-2">
        <h3 className="text-md font-semibold text-gray-600 mt-4 mb-2">
          {field.label}
        </h3>
      </div>
    );
  }
  return null;
};
