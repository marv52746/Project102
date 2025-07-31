import React from "react";

const SelectInput = ({ field, value, onChange, isReadOnly }) => {
  return (
    <select
      id={field.name}
      name={field.name}
      value={value}
      onChange={onChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
    >
      <option value="" disabled>
        Select {field.label}
      </option>
      {field.options.map((option, idx) => (
        <option key={idx} value={option._id || option.id || option.value}>
          {option.name || option.label || option.email}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
