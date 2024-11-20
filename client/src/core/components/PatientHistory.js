import React from "react";
import ExportLinks from "./ExportLinks";

function PatientHistory({ visits }) {
  const columns = [
    { field: "doctor_name", title: "Doctor Name" },
    { field: "visit_type", title: "Visit Type" },
    { field: "visit_date", title: "Visit Date" },
    { field: "diagnosis", title: "Diagnosis" },
    { field: "treatment_provided", title: "Treatment Provided" },
    { field: "status", title: "Status" },
  ];

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-text-secondary">
          Patient History
        </h3>
        <ExportLinks />
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              {/* Dynamic Table Headers */}
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="p-3 font-semibold text-sm text-gray-600"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visits.map((item, index) => (
              <tr
                key={item.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-side-active hover:text-text-secondary hover:cursor-pointer transition-colors duration-200`}
                // onClick={() => handleRowClick(item)}
              >
                {/* Dynamic Table Row Data */}
                {columns.map((col, index) => (
                  <td key={index} className="p-3">
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
      {/* <div className="mt-4">
        
      </div> */}
    </div>
  );
}

export default PatientHistory;
