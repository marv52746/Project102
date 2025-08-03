import React from "react";

export default function PatientsTab() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">Recent Patients</h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Last Visit</th>
            <th className="px-4 py-2 text-left">Condition</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {["John Doe", "Alice Brown"].map((name, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">{name}</td>
              <td className="px-4 py-2">Jul {idx + 1}</td>
              <td className="px-4 py-2">Flu</td>
              <td className="px-4 py-2 text-center">
                <button className="text-blue-500 hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
