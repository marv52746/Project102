import React from "react";

const TextareaInput = ({ field, value, onChange, isReadOnly }) => {
  return (
    <textarea
      id={field.name}
      name={field.name}
      value={value}
      onChange={onChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
      rows={4}
    />
  );
};

export default TextareaInput;
