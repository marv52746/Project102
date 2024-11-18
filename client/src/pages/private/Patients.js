import React from "react";
import TableList from "../../core/components/TableList";

function Patients() {
  const generatePatientData = (num) => {
    const statuses = ["Completed", "Pending", "Cancelled"];
    return Array.from({ length: num }, (_, index) => ({
      id: index + 1,
      name: `Patient ${index + 1}`,
      age: 20 + (index % 30),
      phone: `1234-567-${Math.floor(Math.random() * 900) + 100}`,
      lastVisit: `${Math.floor(Math.random() * 30) + 1}-0${
        Math.floor(Math.random() * 12) + 1
      }-2023`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
  };

  const patientData = generatePatientData(50);

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
      <TableList title="Patients" data={patientData} columns={columns} />
    </div>
  );
}

export default Patients;
