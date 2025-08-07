import React from "react";

const NumberInput = ({ field, value, onChange, isReadOnly }) => {
  return (
    <input
      id={field.name}
      name={field.name}
      type="number"
      inputMode="decimal"
      step={field.step || "1"}
      value={value}
      onChange={onChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
      onKeyDown={(e) => {
        // Prevent invalid characters in number input
        const invalidKeys = ["e", "E", "+", "-"];
        if (invalidKeys.includes(e.key)) {
          e.preventDefault();
        }
      }}
    />
  );
};

export default NumberInput;
