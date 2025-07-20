import React, { useState } from "react";
import TableMini from "../TableMini";
import { ChevronDown, ChevronUp } from "lucide-react";
import { listConfigMap } from "../../constants/FieldConfigMap";

function AppointmentsTable({ appointments }) {
  const [isTableVisible, setIsTableVisible] = useState(true); // State to track table visibility

  const config = listConfigMap["appointments"];
  const columns = config.fieldData;
  // Generate today's date in YYYY-MM-DD format
  const today = new Date();
  const filterDate = today.toISOString().split("T")[0];

  const toggleTable = () => {
    setIsTableVisible(!isTableVisible); // Toggle the table visibility
  };
  return (
    <div className="bg-white shadow-lg p-6 rounded-lg space-y-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleTable}
      >
        <h3 className="text-xl font-semibold text-text-secondary">
          Appointments Today
        </h3>
        {/* Add the toggle icon */}
        <div className="">
          {isTableVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Show or hide the table based on state */}
      {isTableVisible && (
        <TableMini columns={columns} data={appointments} filter={filterDate} />
      )}
    </div>
  );
}

export default AppointmentsTable;
