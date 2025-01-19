import React, { useState } from "react";
import TableMini from "../TableMini";
import { ChevronDown, ChevronUp } from "lucide-react";

function PatientBMI({ visits }) {
  const [isTableVisible, setIsTableVisible] = useState(false); // State to track table visibility

  const columns = [
    { field: "patient_name", title: "Patient Name" },
    { field: "blood_pressure", title: "Blood Pressure" },
    { field: "age", title: "Age" },
    { field: "height_m", title: "Height (m)" },
    { field: "weight_kg", title: "Weight (kg)" },
    { field: "bmi", title: "BMI (kg/m2)" },
    { field: "visit_date", title: "Visit Date" },
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
          Patient BMI Data
        </h3>
        {/* Add the toggle icon */}
        <div onClick={toggleTable} className="cursor-pointer">
          {isTableVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Show or hide the table based on state */}
      {isTableVisible && <TableMini columns={columns} data={visits} />}
    </div>
  );
}

export default PatientBMI;
