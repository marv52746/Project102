import React from "react";

const TextInput = ({ field, value, onChange, isReadOnly }) => {
  return (
    <input
      id={field.name}
      name={field.name}
      type={field.type}
      value={value}
      onChange={onChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
    />
  );
};

export default TextInput;
