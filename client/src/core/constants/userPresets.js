import { genderOptions, roleOptions, statusOptions } from "./formFieldPresets";

// Columns used in the table list
export const userTableColumns = [
  { name: "avatar", label: "Avatar" },
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
  // { name: "name", label: "Name", type: "text", showOn: "all" },
  { name: "first_name", label: "First Name", showOn: "all", required: true },
  { name: "last_name", label: "Last Name", showOn: "all", required: true },
  // { type: "half-spacer", showOn: "create" },
  {
    name: "email",
    label: "Email",
    type: "email",
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
  // {
  //   name: "status",
  //   label: "Status",
  //   type: "select",
  //   options: statusOptions,
  //   showOn: "edit,view",
  // },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: roleOptions,
    showOn: "edit,view",
  },

  { name: "phone_number", label: "Phone", type: "tel", showOn: "all" },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: genderOptions,
    showOn: "all",
  },
  { name: "avatar", label: "Avatar", type: "file", showOn: "all" },
  { name: "address", label: "Address", type: "textarea", showOn: "all" },
  { type: "half-spacer", showOn: "all" },
];

/**
 * Get user fields depending on mode.
 * @param {'form' | 'list'} format - 'form' to get form fields, 'list' for table columns
 * @param {'create' | 'edit' | 'view' | 'all'} show - form mode
 * @returns {Array}
 */
export const getUserFormFields = (format = "form", show = "all") => {
  if (format === "list") {
    return userTableColumns;
  }

  return userFormFields.filter(
    (field) => field.showOn === "all" || field.showOn === show
  );
};
