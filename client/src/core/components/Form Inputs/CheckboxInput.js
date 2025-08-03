import React from "react";

const CheckboxInput = ({ field, value, onChange, isReadOnly }) => {
  return (
    <div className="flex items-center space-x-2 mt-1">
      <input
        id={field.name}
        name={field.name}
        type="checkbox"
        checked={!!value}
        onChange={onChange}
        disabled={field.disabled || isReadOnly}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
      />
      <label htmlFor={field.name} className="text-sm text-gray-700">
        {field.label}
      </label>
    </div>
  );
};

export default CheckboxInput;
