import React from "react";

const DateTimeInput = ({ field, value, onChange, isReadOnly }) => {
  // console.log(field.type);
  // console.log(value);
  return (
    <input
      id={field.name}
      name={field.name}
      type={field.type}
      min={field.min ? new Date().toISOString().split("T")[0] : ""}
      value={value}
      onChange={onChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
    />
  );
};

export default DateTimeInput;
