import React from "react";
import TableList from "../../../core/components/TableList";
import patientsData from "../../../core/data/clinic/patients.json";
import staffData from "../../../core/data/clinic/staff.json";
import laborDelivery from "../../../core/data/clinic/laborDelivery.json";

function LaborAndDelivery() {
  const columns = [
    { field: "id", title: "ID" },
    { field: "pregnancy_id", title: "Pregnancy ID" },
    { field: "patient_name", title: "Patient Name" },
    { field: "doctor_name", title: "Doctor Name" },
    // { field: "labor_start_time", title: "Labor Start Time" },
    // { field: "labor_end_time", title: "Labor End Time" },
    { field: "delivery_time", title: "Delivery Time" },
    { field: "delivery_type", title: "Delivery Type" },

    // { field: "baby_name", title: "Baby Name" },
    // { field: "baby_weight", title: "Baby Weight" },

    { field: "complications", title: "Complications" },
    { field: "status", title: "Status" },
    // { field: "created_at", title: "Created" },
  ];

  const data = laborDelivery.labor_and_delivery
    .map((item) => {
      // Find patient name based on patient_id
      const patient = patientsData.patients.find(
        (p) => p.id === item.patient_id
      );
      // Find doctor name based on doctor_id
      const doctor = staffData.staff.find((d) => d.id === item.staff_id);

      const formattedDate = (date) => new Date(date).toLocaleString();

      // Return a new object with added patient_name and doctor_name
      return {
        ...item,
        patient_name: patient ? patient.name : "Unknown Patient",
        doctor_name: doctor ? doctor.name : "Unknown Doctor",
        labor_start_time: formattedDate(item.labor_start_time),
        labor_end_time: formattedDate(item.labor_end_time),
        delivery_time: formattedDate(item.delivery_time),
      };
    })
    .sort((a, b) => b.id - a.id);
  return (
    <div className="container mx-auto p-4">
      <TableList title="Birth Reports List" data={data} columns={columns} />
    </div>
  );
}

export default LaborAndDelivery;
