import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ScheduleTab() {
  const schedule = [
    { day: "Monday", morning: "9:00–12:00", afternoon: "1:00–4:00" },
    { day: "Tuesday", morning: "9:00–12:00", afternoon: "-" },
    { day: "Wednesday", morning: "-", afternoon: "-" },
    { day: "Thursday", morning: "9:00–12:00", afternoon: "1:00–4:00" },
    { day: "Friday", morning: "10:00–1:00", afternoon: "-" },
    { day: "Saturday", morning: "-", afternoon: "-" },
    { day: "Sunday", morning: "-", afternoon: "-" },
  ];

  const renderTime = (time, isMorning) => {
    if (time === "-") {
      return <span className="text-gray-400 italic">Unavailable</span>;
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isMorning
            ? "bg-yellow-100 text-yellow-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {isMorning ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
        {time}
      </span>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-800">
        Weekly Schedule
      </h3>
      <table className="min-w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Day</th>
            <th className="px-4 py-2 text-left">Morning</th>
            <th className="px-4 py-2 text-left">Afternoon</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {schedule.map(({ day, morning, afternoon }, i) => (
            <tr
              key={i}
              className={`${
                morning !== "-" || afternoon !== "-" ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-4 py-3 font-medium text-gray-800">{day}</td>
              <td className="px-4 py-3">{renderTime(morning, true)}</td>
              <td className="px-4 py-3">{renderTime(afternoon, false)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
