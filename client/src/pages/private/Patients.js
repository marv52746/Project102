import React from "react";
import TableList from "../../core/components/TableList";
import mockPatientData from "../../core/data/mockPatientData.json";

function Patients() {
  const patients = mockPatientData.patients;

  const columns = [
    { field: "id", title: "Patient ID" },
    { field: "name", title: "Patient Name" },
    { field: "age", title: "Age" },
    { field: "phone", title: "Phone" },
    { field: "lastVisit", title: "Last Visit" },
    { field: "status", title: "Status" },
  ];

  return (
    <div className="container mx-auto p-4">
      <TableList title="Patients" data={patients} columns={columns} />
    </div>
  );
}

export default Patients;
