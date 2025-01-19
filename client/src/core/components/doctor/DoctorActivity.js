import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import TableMini from "../TableMini";
// import ExportLinks from "./ExportLinks";

// Main DoctorActivity Component
const DoctorActivity = ({ doctorActivity }) => {
  const [isTableVisible, setIsTableVisible] = useState(false); // State to track table visibility

  const columns = [
    { field: "patient_name", title: "Patient Name" },
    { field: "appointment_type", title: "Appointment Type" },
    { field: "appointment_date", title: "Appointment Date" },
    { field: "notes", title: "Notes" },
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
          Staff Activity History
        </h3>
        {/* Add the toggle icon */}
        <div className="">
          {isTableVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Show or hide the table based on state */}
      {isTableVisible && <TableMini columns={columns} data={doctorActivity} />}
    </div>
  );
};

export default DoctorActivity;
