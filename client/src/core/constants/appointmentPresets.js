// Table columns for Appointment list view
export const appointmentTableColumns = [
  { name: "appointment_no", label: "No." },
  { name: "patient.name", label: "Patient Name" },
  { name: "reason", label: "Reason" },
  { name: "doctor.name", label: "Doctor Name" },
  { name: "date", label: "Appointment Date" },
  { name: "time", label: "Time" },
  { name: "status", label: "Status" },
];

// Appointment status dropdown options (you can customize the labels)
const appointmentStatusOptions = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Ready", value: "ready" },
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
    required: true,
  },
  {
    name: "doctor",
    label: "Doctor",
    type: "reference",
    ref: "users", // table/endpoint to call
    query: { role: "doctor" }, // 👈 Add this to filter by role
    showOn: "all",
    required: true,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    showOn: "all",
    default: new Date(),
    required: true,
  },
  {
    name: "time",
    label: "Time",
    type: "time",
    showOn: "all",
    default: new Date().toTimeString().slice(0, 5),
    required: true,
  },

  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    showOn: "all",
    required: true,
    fullRow: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: appointmentStatusOptions,
    showOn: "edit,view",
  },
  // {
  //   name: "notes",
  //   label: "Notes",
  //   type: "textarea",
  //   showOn: "all",
  // },
];
