import { bloodTypeOptions } from "./choices";
import { genderOptions, roleOptions } from "./formFieldPresets";

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
    label: "User",
    type: "reference",
    ref: "users",
    query: { role: "guest" }, // 👈 Add this to filter by role
    showOn: "all",
    required: true,
    section: "main",
  },
  // { type: "half-spacer", showOn: "all" },
  // {
  //   name: "emergency_contact",
  //   label: "Emergency Contact",
  //   type: "text",
  //   showOn: "all",
  // },
  // {
  //   name: "blood_type",
  //   label: "Blood Type",
  //   options: bloodTypeOptions,
  //   type: "select",
  //   showOn: "all",
  // },
  // {
  //   name: "medical_notes",
  //   label: "Medical Notes",
  //   type: "textarea",
  //   showOn: "all",
  // },
  // {
  //   name: "registration_date",
  //   label: "Registration Date",
  //   type: "date",
  //   showOn: "edit,view",
  //   default: new Date(),
  // },
  {
    name: "first_name",
    label: "First Name",
    showOn: "all",
    required: true,
    section: "patient",
  },
  {
    name: "last_name",
    label: "Last Name",
    showOn: "all",
    required: true,
    section: "patient",
  },
  // { type: "half-spacer", showOn: "create" },
  {
    name: "email",
    label: "Email",
    type: "email",
    showOn: "all",
    required: true,
    section: "patient", // 👈 to make it toggleable
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    showOn: "all",
    required: true,
    section: "patient", // 👈 to make it toggleable
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    showOn: "create",
    required: true,
    section: "patient", // 👈 to make it toggleable
  },
  {
    name: "phone_number",
    label: "Phone",
    type: "tel",
    showOn: "all",
    required: true,
    section: "patient", // 👈 to make it toggleable
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: roleOptions,
    showOn: "edit,view",
    section: "patient", // 👈 to make it toggleable
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: genderOptions,
    showOn: "all",
    required: true,
    section: "patient", // 👈 to make it toggleable
  },
  { type: "half-spacer", showOn: "all", section: "patient" },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    showOn: "all",
    required: true,
    section: "patient", // 👈 to make it toggleable
  },
  // {
  //   name: "avatar",
  //   label: "Avatar",
  //   type: "file",
  //   showOn: "all",
  //   section: "patient",
  // },
];
