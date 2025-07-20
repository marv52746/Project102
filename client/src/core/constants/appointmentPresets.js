// Table columns for Appointment list view
export const appointmentTableColumns = [
  { name: "appointment_no", label: "Appointment No." },
  { name: "patient.name", label: "Patient" },
  { name: "doctor.name", label: "Doctor" },
  { name: "date", label: "Date" },
  { name: "time", label: "Time" },
  { name: "status", label: "Status" },
  { name: "reason", label: "Reason" },
];

// Appointment status dropdown options (you can customize the labels)
const appointmentStatusOptions = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "No-show", value: "no-show" },
  { label: "Rescheduled", value: "rescheduled" },
];

// Form fields with conditional visibility
export const appointmentFormFields = [
  {
    name: "appointment_no",
    label: "Appointment No.",
    type: "text",
    showOn: "edit,view",
    disabled: true,
  },
  { type: "half-spacer", showOn: "edit,view" },
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users", // table/endpoint to call
    query: { role: "patient" },
    showOn: "all",
  },
  {
    name: "doctor",
    label: "Doctor",
    type: "reference",
    ref: "users", // table/endpoint to call
    query: { role: "doctor" }, // 👈 Add this to filter by role
    showOn: "all",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    showOn: "all",
  },
  {
    name: "time",
    label: "Time",
    type: "time",
    showOn: "all",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: appointmentStatusOptions,
    showOn: "all",
  },
  {
    name: "reason",
    label: "Reason",
    type: "text",
    showOn: "all",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    showOn: "all",
  },
];
