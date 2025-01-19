import React from "react";
import TableList from "../../../core/components/TableList";
import patientsData from "../../../core/data/clinic/patients.json";
import staffData from "../../../core/data/clinic/staff.json";
import payments from "../../../core/data/clinic/payments.json";

function Payments() {
  const columns = [
    { field: "id", title: "ID" },
    { field: "appointment_id", title: "Appointment ID" },
    { field: "patient_name", title: "Patient Name" },

    { field: "service_type", title: "Service Type" },
    { field: "payment_method", title: "Payment Method" },
    { field: "payment_date", title: "Payment Time" },
    { field: "amount", title: "Amount" },

    { field: "status", title: "Status" },
  ];

  const data = payments.payments
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
        payment_date: formattedDate(item.payment_date),
      };
    })
    .sort((a, b) => b.id - a.id);
  return (
    <div className="container mx-auto p-4">
      <TableList title="Birth Reports List" data={data} columns={columns} />
    </div>
  );
}

export default Payments;
