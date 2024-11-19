import React from "react";
import ExportLinks from "./ExportLinks";

// Main DoctorActivity Component
const DoctorActivity = ({ doctorActivity }) => {
  const columns = [
    { field: "appointment_type", title: "Visit Type" },
    { field: "patient_name", title: "Patient Name" },
    { field: "problem", title: "Problem" },
    { field: "diagnosis", title: "Diagnosis" },
    { field: "appointment_date", title: "Date" },
    { field: "status", title: "Status" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-text-secondary">
          Doctor Activity
        </h3>
        <ExportLinks />
      </div>
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              {/* Dynamic Table Headers */}
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="p-3 font-semibold text-sm text-gray-600"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctorActivity.map((item, index) => (
              <tr
                key={item.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-side-active hover:text-text-secondary hover:cursor-pointer transition-colors duration-200`}
                // onClick={() => handleRowClick(item)}
              >
                {/* Dynamic Table Row Data */}
                {columns.map((col) => (
                  <td key={col.field} className="p-3">
                    {col.field === "status" ? (
                      <span
                        className={`badge px-2 py-1 rounded-full text-white text-xs ${
                          item.status === "Completed"
                            ? "bg-green-500"
                            : item.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : (
                      item[col.field] // Render the data for other fields
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorActivity;
