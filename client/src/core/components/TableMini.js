import React from "react";

function TableMini({ columns, data }) {
  return (
    <div className="overflow-x-auto flex-grow">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="text-left border-b">
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
          {/* Check if data is empty and show "No Records Found" */}
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length} // Span across all columns
                className="p-3 text-center text-gray-500"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            // Render rows for each data item if data is available
            data.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b ${
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableMini;
