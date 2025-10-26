import { inventoyTypeOptions } from "./choices";

// Table columns for Appointment list view
export const inventoryLogsTableColumns = [
  { name: "item.name", label: "Item Name" },
  { name: "type", label: "Type" },
  { name: "quantity", label: "Quantity" },
  { name: "reason", label: "Reason" },
  { name: "created_by.name", label: "Created By" },
  { name: "timestamp", label: "Date" },
];

// Form fields with conditional visibility
export const inventoryLogsFormFields = [
  {
    name: "item",
    label: "Item Name",
    type: "reference",
    ref: "inventory", // table/endpoint to call
    showOn: "all",
    required: true,
  },
  // {
  //   name: "created_by",
  //   label: "Created By",
  //   type: "reference",
  //   ref: "users", // table/endpoint to call
  //   showOn: "create,view",
  //   required: true,
  // },
  // { type: "spacer", showOn: "all" },

  {
    name: "item.quantity",
    label: "Current stock",
    type: "number",
    showOn: "all",
    required: true,
    disabled: true,
    condition: "",
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: inventoyTypeOptions,
    showOn: "all",
    // default: "Stock out",
    required: true,
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    showOn: "all",
    required: true,
  },

  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    showOn: "all",
  },
  // {
  //   name: "timestamp",
  //   label: "Timestamp",
  //   type: "date-time",
  //   showOn: "create,view",
  // },
];
