import React from "react";

// Format JS Date or ISO string to "YYYY-MM-DDTHH:MM" in local timezone
const formatDateToDatetimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const DateTimeInput = ({ field, value, onChange, isReadOnly }) => {
  return (
    <input
      id={field.name}
      name={field.name}
      type="datetime-local"
      value={formatDateToDatetimeLocal(value)}
      onChange={onChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
    />
  );
};

export default DateTimeInput;
