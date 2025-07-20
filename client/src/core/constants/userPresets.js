import { genderOptions, roleOptions, statusOptions } from "./formFieldPresets";

// Columns used in the table list
export const userTableColumns = [
  { name: "avatar", label: "Avatar" },
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "phone_number", label: "Phone" },
  { name: "gender", label: "Gender" },
  { name: "address", label: "Address" },
  { name: "role", label: "Role" },
];

// Form field definitions with conditional visibility
// showOn: 'create' | 'edit' | 'view' | 'all'
export const userFormFields = [
  { name: "name", label: "Name", type: "text", showOn: "all" },
  { type: "half-spacer", showOn: "create" },
  { name: "email", label: "Email", type: "email", showOn: "all" },
  { name: "password", label: "Password", type: "password", showOn: "create" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    showOn: "edit,view",
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
  },
  { name: "phone_number", label: "Phone", type: "tel", showOn: "all" },
  { name: "address", label: "Address", type: "textarea", showOn: "all" },
  { type: "half-spacer", showOn: "all" },
  { name: "avatar", label: "Avatar", type: "file", showOn: "all" },
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
