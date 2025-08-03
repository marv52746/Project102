import React from "react";

export default function ScheduleTab() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Weekly Schedule</h3>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-2">Day</th>
            <th className="px-4 py-2">Morning</th>
            <th className="px-4 py-2">Afternoon</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Monday", "9:00–12:00", "1:00–4:00"],
            ["Tuesday", "9:00–12:00", "-"],
            ["Wednesday", "-", "-"],
            ["Thursday", "9:00–12:00", "1:00–4:00"],
            ["Friday", "10:00–1:00", "-"],
            ["Saturday", "-", "-"],
            ["Sunday", "-", "-"],
          ].map(([day, morning, afternoon], i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{day}</td>
              <td className="px-4 py-2">{morning}</td>
              <td className="px-4 py-2">{afternoon}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
