import { bloodTypeOptions } from "./choices";

export const patientTableColumns = [
  { name: "patient.name", label: "Name" },
  { name: "patient.gender", label: "Gender" },
  { name: "patient.date_of_birth", label: "Date of Birth" },
  // { name: "emergency_contact", label: "Emergency Contact" },
  { name: "patient.address", label: "Address" },
  { name: "patient.phone_number", label: "Phone Number" },
  { name: "blood_type", label: "Blood Type" },
  // { name: "registration_date", label: "Registration Date" },
];

// Form fields with conditional visibility
export const patientFormFields = [
  {
    name: "patient",
    label: "Patient",
    type: "reference",
    ref: "users",
    query: { role: "patient" }, // 👈 Add this to filter by role
    showOn: "all",
    required: true,
  },
  { type: "half-spacer", showOn: "all" },
  {
    name: "emergency_contact",
    label: "Emergency Contact",
    type: "text",
    showOn: "all",
  },
  {
    name: "blood_type",
    label: "Blood Type",
    options: bloodTypeOptions,
    type: "select",
    showOn: "all",
  },
  {
    name: "medical_notes",
    label: "Medical Notes",
    type: "textarea",
    showOn: "all",
  },
  {
    name: "registration_date",
    label: "Registration Date",
    type: "date",
    showOn: "edit,view",
    default: new Date(),
  },
];
