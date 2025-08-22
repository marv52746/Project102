import { bloodTypeOptions, doctorSpecializationOptions } from "./choices";
import { genderOptions, roleOptions } from "./formFieldPresets";

export const doctorTableColumns = [
  { name: "name", label: "Name" },
  { name: "gender", label: "Gender" },
  { name: "date_of_birth", label: "Date of Birth" },
  { name: "phone_number", label: "Phone Number" },
];

// Form fields with conditional visibility
export const doctorFormFields = [
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
  { type: "spacer", showOn: "all", section: "main" },
  {
    name: "specialization",
    label: "Specialization",
    options: doctorSpecializationOptions,
    type: "multiselect",
    showOn: "all",
    required: true,
    section: "main", // 👈 to make it toggleable
  },
  { type: "spacer", showOn: "all", section: "main" },
  {
    name: "first_name",
    label: "First Name",
    showOn: "all",
    required: true,
    section: "user",
  },
  {
    name: "last_name",
    label: "Last Name",
    showOn: "all",
    required: true,
    section: "user",
  },
  // { type: "half-spacer", showOn: "create" },
  {
    name: "email",
    label: "Email",
    type: "email",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    type: "date",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    showOn: "create",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "phone_number",
    label: "Phone",
    type: "tel",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: roleOptions,
    showOn: "edit,view",
    section: "user", // 👈 to make it toggleable
    disabled: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: genderOptions,
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "blood_type",
    label: "Blood Type",
    options: bloodTypeOptions,
    type: "select",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },

  { type: "spacer", showOn: "all", section: "user" },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    showOn: "all",
    required: true,
    section: "user", // 👈 to make it toggleable
  },
  {
    name: "avatar",
    label: "Avatar",
    type: "file",
    showOn: "all",
    section: "user",
  },
];
