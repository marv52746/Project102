import React from "react";

const TimeInput = ({ field, value, onChange, isReadOnly }) => {
  const handleTimeChange = (e) => {
    let inputValue = e.target.value;

    // Clamp between 09:00 and 17:00
    if (inputValue < "09:00") inputValue = "09:00";
    if (inputValue > "17:00") inputValue = "17:00";

    // Round to nearest 15-minute interval
    const [hour, minute] = inputValue.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;
    const roundedMinutes = Math.round(totalMinutes / 15) * 15;

    const roundedHour = Math.floor(roundedMinutes / 60);
    const roundedMinute = roundedMinutes % 60;

    const finalHour = String(roundedHour).padStart(2, "0");
    const finalMinute = String(roundedMinute).padStart(2, "0");
    const adjustedTime = `${finalHour}:${finalMinute}`;

    // ✅ Call parent handler
    onChange({
      target: {
        name: field.name,
        value: adjustedTime,
      },
    });
  };

  return (
    <input
      id={field.name}
      name={field.name}
      type={field.type || "time"}
      min="09:00"
      max="17:00"
      step="900"
      value={value || ""}
      onChange={handleTimeChange}
      disabled={field.disabled || isReadOnly}
      required={field.required}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
    />
  );
};

export default TimeInput;
