import React from "react";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ✅ Convert "14:30" → "2:30 PM"
const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hour, minute] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
  rescheduled: "bg-purple-100 text-purple-800",
  "no-show": "bg-yellow-100 text-yellow-800",
};

export default function CalendarDayModal({
  appointments = [],
  onClose,
  onSelect,
}) {
  if (!appointments.length) return null;

  const isToday = formatDate(appointments[0].date) === formatDate(new Date());
  const title = isToday
    ? "Appointments for today"
    : `Appointments for ${formatDate(appointments[0].date)}`;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-5">{title}</h2>

        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
          {appointments.map((appt, i) => {
            const badgeClass =
              statusColors[appt.status] || "bg-gray-100 text-gray-700";

            return (
              <li
                key={i}
                className="p-3 border rounded hover:shadow cursor-pointer transition"
                onClick={() => onSelect(appt)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-800">
                    {appt.patient_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(appt.time)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 mb-1 truncate">
                    {appt.reason || "No reason provided"}
                  </span>
                  <span
                    className={
                      "inline-block text-xs px-2 py-0.5 rounded-full font-medium capitalize " +
                      badgeClass
                    }
                  >
                    {appt.status || "unknown"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-right">
          <button
            className="px-4 py-2 text-sm font-medium rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
