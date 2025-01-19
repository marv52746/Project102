import React from "react";
import AppointmentDetailsCard from "../../../core/components/appoinment/AppointmentDetailsCard";
import { useParams } from "react-router-dom";

import patientsData from "../../../core/data/clinic/patients.json";
import appointmentsData from "../../../core/data/clinic/appointments.json";
import staffData from "../../../core/data/clinic/staff.json";

const AppointmentDetails = () => {
  const { id, view } = useParams();

  // const formatDate = (date) => new Date(date).toLocaleString();
  // Find the appointment data based on the `id` parameter from URL
  const initialData = appointmentsData.appointments.find(
    (item) => item.id.toString() === id
  );

  const patient = patientsData.patients.find(
    (p) => p.id === initialData.patient_id
  );

  // Find doctor name based on staff_id
  const doctor = staffData.staff.find((d) => d.id === initialData.staff_id);

  // Format the appointment_date to local date string
  // const formattedDate = formatDate(initialData.appointment_date);

  const data = {
    ...initialData,
    patient_name: patient ? patient.name : "Unknown Patient",
    doctor_name: doctor ? doctor.name : "Unknown Doctor",
    // appointment_date: formattedDate,
  };

  // If no data is found, return a loading state or a message
  if (!data) {
    return <div>Loading...</div>;
  }

  // Disable editing based on view mode
  const isDisabled = view === "view";

  // Define the form fields dynamically based on the data
  const fields = [
    {
      label: "Patient Name",
      name: "patient_name",
      type: "select",
      disabled: isDisabled,
      options: patientsData.patients,
    },
    {
      label: "Doctor Name",
      name: "doctor_name",
      type: "select", // Change input type to 'select' for reference field
      disabled: isDisabled,
      options: staffData.staff, // The list of doctors for reference type
    },
    {
      label: "Appointment Type",
      name: "appointment_type",
      type: "text",
      disabled: isDisabled,
    },
    {
      label: "Appointment Date",
      name: "appointment_date",
      type: "datetime-local",
      disabled: isDisabled,
    },
    { label: "Notes", name: "notes", type: "textarea", disabled: isDisabled },
    {
      label: "Status",
      name: "status",
      type: "select", // Changing to 'select' type for status options
      disabled: isDisabled,
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "Confirmed", label: "Confirmed" },
        { value: "Completed", label: "Completed" },
        { value: "Cancelled", label: "Cancelled" },
      ], // Status options
    },
  ];

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        {/* Passing tableData to AppointmentDetailsCard as a prop */}
        <AppointmentDetailsCard data={data} fields={fields} />
      </div>
    </div>
  );
};

export default AppointmentDetails;
