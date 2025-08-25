import { bloodTypeOptions } from "./choices";
import { genderOptions, roleOptions } from "./formFieldPresets";

// export const patientTableColumns = [
//   { name: "user.name", label: "Name" },
//   { name: "user.gender", label: "Gender" },
//   { name: "user.date_of_birth", label: "Date of Birth" },
//   { name: "user.phone_number", label: "Phone Number" },
//   { name: "user.blood_type", label: "Blood Type" },
// ];
export const patientTableColumns = [
  // { name: "avatar", label: "Avatar" },
  { name: "name", label: "Name" },
  { name: "gender", label: "Gender" },
  { name: "date_of_birth", label: "Date of Birth" },
  { name: "phone_number", label: "Phone Number" },
  { name: "blood_type", label: "Blood Type" },
];

// Form fields with conditional visibility
export const patientFormFields = [
  {
    name: "user_does_not_exist",
    label: "User does not exist?",
    type: "checkbox",
    showOn: "create",
    section: "main",
    default: false,
  },
  { type: "spacer", showOn: "all", section: "main" },
  {
    name: "user",
    label: "User",
    type: "reference",
    ref: "users",
    query: { role: "guest" }, // 👈 Add this to filter by role
    showOn: "create",
    required: true,
    section: "main",
  },
  {
    name: "user.first_name",
    label: "First Name",
    showOn: "all",
    required: true,
    section: "user",
  },
  {
    name: "user.last_name",
    label: "Last Name",
    showOn: "all",
    required: true,
    section: "user",
  },
  // { type: "half-spacer", showOn: "create" },
  {
    name: "user.email",
    label: "Email",
    type: "email",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "user.date_of_birth",
    label: "Date of Birth",
    type: "date",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "user.password",
    label: "Password",
    type: "password",
    showOn: "create",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "user.phone_number",
    label: "Phone",
    type: "tel",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "user.role",
    label: "Role",
    type: "select",
    options: roleOptions,
    showOn: "edit,view",
    section: "user", // 👈 to make it toggleable
    disabled: true,
  },
  {
    name: "user.gender",
    label: "Gender",
    type: "select",
    options: genderOptions,
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "user.blood_type",
    label: "Blood Type",
    options: bloodTypeOptions,
    type: "select",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  { type: "spacer", showOn: "all", section: "user" },
  {
    name: "user.address",
    label: "Address",
    type: "textarea",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  // {
  //   name: "avatar",
  //   label: "Avatar",
  //   type: "file",
  //   showOn: "all",
  //   section: "patient",
  // },
];
