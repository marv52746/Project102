import React, { useState } from "react";
// import ExportLinks from "./ExportLinks";
import TableMini from "./TableMini";
import { ChevronDown, ChevronUp } from "lucide-react";

function PatientHistory({ visits }) {
  const [isTableVisible, setIsTableVisible] = useState(false); // State to track table visibility
  const columns = [
    { field: "doctor_name", title: "Doctor Name" },
    { field: "visit_type", title: "Visit Type" },
    { field: "visit_date", title: "Visit Date" },
    { field: "diagnosis", title: "Diagnosis" },
    { field: "treatment_provided", title: "Treatment Provided" },
    { field: "status", title: "Status" },
  ];

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
          Patient Appointments
        </h3>
        {/* Add the toggle icon */}
        <div className="">
          {isTableVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Show or hide the table based on state */}
      {isTableVisible && <TableMini columns={columns} data={visits} />}
    </div>
  );
}

export default PatientHistory;
