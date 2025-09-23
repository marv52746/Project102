import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const getPHDate = () => {
  const formatter = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return new Date(
    `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`
  );
};

const CustomDatePicker = ({ value, onChange, open, onClose }) => {
  const today = getPHDate();
  const [currentMonth, setCurrentMonth] = useState(today);
  const ref = useRef(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  // Get first and last day of the month
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  // Build calendar grid
  const days = [];
  for (let i = 0; i < startOfMonth.getDay(); i++) {
    days.push(null);
  }
  for (let d = 1; d <= endOfMonth.getDate(); d++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button" // ✅ Prevent form submission
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-semibold text-gray-700">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <button
          type="button" // ✅ Prevent form submission
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {days.map((day, i) =>
          day ? (
            <button
              key={i}
              onClick={() => {
                onChange(formatDate(day));
                if (onClose) onClose();
              }}
              className={`p-2 text-sm rounded-lg transition-all
                ${
                  value === formatDate(day)
                    ? "bg-pink-500 text-white"
                    : formatDate(day) === formatDate(today)
                    ? "border border-pink-400 text-pink-600"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {day.getDate()}
            </button>
          ) : (
            <div key={i}></div>
          )
        )}
      </div>

      {/* Today Button */}
      <button
        onClick={() => {
          onChange(formatDate(today));
          setCurrentMonth(today);
          if (onClose) onClose();
        }}
        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
      >
        Today
      </button>
    </div>
  );
};

export default CustomDatePicker;
