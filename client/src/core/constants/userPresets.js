import { bloodTypeOptions, doctorSpecializationOptions } from "./choices";
import { genderOptions, roleOptions } from "./formFieldPresets";

// Columns used in the table list
export const userTableColumns = [
  // { name: "avatar", label: "Avatar" },
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "phone_number", label: "Phone" },
  // { name: "gender", label: "Gender" },
  // { name: "address", label: "Address" },
  { name: "role", label: "Role" },
  { name: "created_on", label: "Created" },
];

export const userSettings = [
  { label: "First Name", name: "first_name", required: true },
  { label: "Last Name", name: "last_name", required: true },
  { label: "Phone Number", name: "phone_number", required: true },
  { label: "Email Address", name: "email", type: "email", required: true },
  { label: "Date of Birth", name: "date_of_birth", type: "date" },
  // { label: "Password", name: "password", type: "password" },
];

// Form field definitions with conditional visibility
// showOn: 'create' | 'edit' | 'view' | 'all'
export const userFormFields = [
  {
    name: "first_name",
    label: "First Name",
    showOn: "all",
    required: true,
    type: "text",
  },
  {
    name: "last_name",
    label: "Last Name",
    showOn: "all",
    required: true,
    type: "text",
  },
  // { type: "half-spacer", showOn: "create" },
  {
    name: "email",
    label: "Email",
    type: "email",
    showOn: "all",
    required: true,
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    showOn: "all",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    showOn: "create",
    required: true,
  },
  {
    name: "phone_number",
    label: "Phone",
    type: "tel",
    showOn: "all",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: roleOptions,
    showOn: "edit,view",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: genderOptions,
    showOn: "all",
    required: true,
  },
  {
    name: "blood_type",
    label: "Blood Type",
    options: bloodTypeOptions,
    type: "select",
    showOn: "all",
    required: true,
  },

  {
    name: "address",
    label: "Address",
    type: "textarea",
    showOn: "all",
    required: true,
  },
  { type: "spacer", showOn: "all" },
  {
    name: "specialization",
    label: "Specialization",
    options: doctorSpecializationOptions,
    condition: "doctor",
    type: "multiselect",
    showOn: "all",
    required: true,
  },
  { type: "spacer", showOn: "all" },
  { name: "avatar", label: "Avatar", type: "file", showOn: "all" },
];
