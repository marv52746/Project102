import React from "react";
import TableList from "../../../core/components/TableList";
import pregnancies from "../../../core/data/clinic/pregnancies.json";
import patientsData from "../../../core/data/clinic/patients.json";
import staffData from "../../../core/data/clinic/staff.json";

function Pregnancies() {
  const columns = [
    { field: "id", title: "ID" },
    { field: "patient_name", title: "Patient Name" },
    { field: "lmp_date", title: "LMP Date" },
    { field: "ultrasound_date", title: "Ultrasound Date" },
    { field: "edd", title: "Estimated Due Date" },
    { field: "status", title: "Status" },
    // { field: "created_at", title: "Created" },
  ];

  const data = pregnancies.pregnancies
    .map((item) => {
      // Find patient name based on patient_id
      const patient = patientsData.patients.find(
        (p) => p.id === item.patient_id
      );
      // Find doctor name based on doctor_id
      const doctor = staffData.staff.find((d) => d.id === item.staff_id);

      // Return a new object with added patient_name and doctor_name
      return {
        ...item,
        patient_name: patient ? patient.name : "Unknown Patient",
        doctor_name: doctor ? doctor.name : "Unknown Doctor",
      };
    })
    .sort((a, b) => b.id - a.id);
  return (
    <div className="container mx-auto p-4">
      <TableList title="Birth Reports List" data={data} columns={columns} />
    </div>
  );
}

export default Pregnancies;
