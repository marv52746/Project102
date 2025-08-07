import { inventoyTypeOptions } from "./choices";

// Table columns for Appointment list view
export const inventoryLogsTableColumns = [
  { name: "item.name", label: "Item Name" },
  { name: "type", label: "Type" },
  { name: "quantity", label: "Quantity" },
  { name: "reason", label: "Reason" },
  { name: "performedBy.name", label: "Performed By" },
  { name: "timestamp", label: "Date" },
];

// Form fields with conditional visibility
export const inventoryLogsFormFields = [
  {
    name: "item",
    label: "Item Name",
    type: "reference",
    ref: "inventory", // table/endpoint to call
    showOn: "create,view",
    required: true,
  },
  {
    name: "performedBy",
    label: "Performed By",
    type: "reference",
    ref: "users", // table/endpoint to call
    showOn: "create,view",
    required: true,
  },
  // { type: "spacer", showOn: "all" },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: inventoyTypeOptions,
    showOn: "create,view",
  },
  {
    name: "quantity",
    label: "Quantity",
    type: "number",
    showOn: "create,view",
  },

  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    showOn: "create,view",
  },
  {
    name: "timestamp",
    label: "Timestamp",
    type: "date-time",
    showOn: "create,view",
  },
];
