import React from "react";

const AppointmentsTable = ({ appointments }) => {
  const statusClasses = {
    Completed: "bg-green-500 text-white",
    Pending: "bg-yellow-500 text-white",
    Cancelled: "bg-red-500 text-white",
  };

  return (
    <div className="col-md-12">
      <div className="bg-background shadow-md rounded-lg p-4">
        <h3 className="text-xl font-semibold text-sidetext-active">
          Appointments Today
        </h3>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Patient Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Doctor
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Check-Up
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Time
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {appointment.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {appointment.doctor}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {appointment.checkUp}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {appointment.date}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {appointment.time}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block py-1 px-3 text-xs font-semibold rounded-full ${
                        statusClasses[appointment.status]
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTable;
