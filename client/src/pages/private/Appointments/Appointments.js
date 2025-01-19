import React from "react";
import TableList from "../../../core/components/TableList";
import appointmentData from "../../../core/data/clinic/appointments.json";
import patientsData from "../../../core/data/clinic/patients.json";
import staffData from "../../../core/data/clinic/staff.json";

function Appointments() {
  // Fetch appointments from appointmentData
  const data = appointmentData.appointments
    .map((appointment) => {
      // Find patient name based on patient_id
      const patient = patientsData.patients.find(
        (p) => p.id === appointment.patient_id
      );
      // Find doctor name based on doctor_id
      const doctor = staffData.staff.find((d) => d.id === appointment.staff_id);

      // Format the appointment_date to local date string
      const formattedDate = new Date(
        appointment.appointment_date
      ).toLocaleString();

      // Return a new object with added patient_name and doctor_name
      return {
        ...appointment,
        patient_name: patient ? patient.name : "Unknown Patient",
        doctor_name: doctor ? doctor.name : "Unknown Doctor",
        appointment_date: formattedDate, // Add formatted date here
      };
    })
    .sort((a, b) => b.id - a.id);

  const columns = [
    { field: "id", title: "ID" },
    { field: "patient_name", title: "Patient Name" },
    { field: "doctor_name", title: "Doctor Name" },
    { field: "appointment_type", title: "Appointment Type" },
    { field: "appointment_date", title: "Appointment Date" },
    { field: "notes", title: "Notes" },
    { field: "status", title: "Status" },
  ];

  return (
    <div className="container mx-auto p-4">
      <TableList title="Appointment List" data={data} columns={columns} />
    </div>
  );
}

export default Appointments;
