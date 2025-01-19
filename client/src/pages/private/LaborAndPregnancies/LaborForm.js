import React from "react";
import { useParams } from "react-router-dom";

import patientsData from "../../../core/data/clinic/patients.json";
import staffData from "../../../core/data/clinic/staff.json";

import laborData from "../../../core/data/clinic/laborDelivery.json";
import FormFormat from "../../../core/components/FormFormat";

const LaborForm = () => {
  const { id, view } = useParams();

  // Find the appointment data based on the `id` parameter from URL
  const initialData = laborData.labor_and_delivery.find(
    (item) => item.id.toString() === id
  );

  const patient = patientsData.patients.find(
    (p) => p.id === initialData.patient_id
  );

  // Find doctor name based on staff_id
  const doctor = staffData.staff.find((d) => d.id === initialData.staff_id);

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
      label: "ID",
      name: "id",
      type: "text",
      disabled: true,
    },
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
    {
      label: "Patient Name",
      name: "patient_id",
      type: "select",
      disabled: isDisabled,
      options: patientsData.patients,
    },
    {
      label: "Doctor Name",
      name: "staff_id",
      type: "select",
      disabled: isDisabled,
      options: staffData.staff,
    },
    {
      label: "Delivery Date",
      name: "delivery_time",
      type: "datetime-local",
      disabled: isDisabled,
    },
    {
      label: "Delivery Type",
      name: "delivery_type",
      type: "text",
      disabled: isDisabled,
    },
    {
      label: "Complications",
      name: "complications",
      type: "textarea",
      disabled: isDisabled,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        {/* Passing tableData to AppointmentDetailsCard as a prop */}
        <FormFormat data={data} fields={fields} />
      </div>
    </div>
  );
};

export default LaborForm;
