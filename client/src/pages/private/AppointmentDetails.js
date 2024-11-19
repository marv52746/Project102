import React from "react";
import AppointmentDetailsCard from "../../core/components/AppointmentDetailsCard";
import doctorsActivity from "../../core/data/doctorsActivity.json";
import { useParams } from "react-router-dom";

const AppointmentDetails = () => {
  const { id } = useParams();

  // Find the appointment data based on the `id` parameter from URL
  const data = doctorsActivity.appointments.find(
    (item) => item.id.toString() === id
  );

  // If no data is found, return a loading state or a message
  if (!data) {
    return <div>Loading...</div>;
  }

  // Prepare the data for the table
  const tableData = [
    { field: "Patient ID", value: data.id },
    { field: "Department", value: data.department },
    { field: "Doctor Name", value: data.doctor_name },
    { field: "Appointment Date", value: data.appointment_date },
    { field: "Time Slot", value: data.appointment_time },
    { field: "Token Number", value: data.token_number },
    { field: "Problem", value: data.problem },
  ];

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        {/* Passing tableData to AppointmentDetailsCard as a prop */}
        <AppointmentDetailsCard tableData={tableData} />
      </div>
    </div>
  );
};

export default AppointmentDetails;
