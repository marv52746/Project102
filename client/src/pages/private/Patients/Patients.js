import React from "react";
import TableList from "../../../core/components/TableList";
import patientsData from "../../../core/data/clinic/patients.json";

function Patients() {
  const patients = patientsData.patients;

  const columns = [
    { field: "avatar", title: "Avatar" },
    { field: "id", title: "Patient ID" },
    { field: "name", title: "Patient Name" },
    { field: "age", title: "Age" },
    { field: "phone", title: "Phone" },
    { field: "gender", title: "Gender" },
    { field: "address", title: "Address" },
    { field: "status", title: "Status" },
  ];

  return (
    <div className="container mx-auto p-4">
      <TableList title="Patients" data={patients} columns={columns} />
    </div>
  );
}

export default Patients;
