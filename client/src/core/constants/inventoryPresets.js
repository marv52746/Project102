import { inventoryUnitOptions, inventoyCategoryOptions } from "./choices";

// Table columns for Appointment list view
export const inventoryTableColumns = [
  { name: "name", label: "Name" },
  { name: "category", label: "Category" },
  { name: "quantity", label: "Quantity" },
  { name: "unit", label: "Unit" },
  { name: "reorderLevel", label: "Reorder Level" },
  { name: "expiryDate", label: "Expiry Date" },
  // { name: "supplier", label: "supplier" },
  // { name: "batchNumber", label: "batchNumber" },
  // { name: "notes", label: "notes" },
  // { name: "createdAt", label: "createdAt" },
];

// Form fields with conditional visibility
export const inventoryFormFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    showOn: "all",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: inventoyCategoryOptions,
    showOn: "all",
  },
  {
    name: "unit",
    label: "Unit",
    type: "select",
    options: inventoryUnitOptions,
    showOn: "all",
  },
  // {
  //   name: "quantity",
  //   label: "Quantity",
  //   type: "number",
  //   showOn: "all",
  // },
  {
    name: "reorderLevel",
    label: "Reorder Level",
    type: "number",
    showOn: "all",
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    showOn: "all",
  },
  {
    name: "supplier",
    label: "Supplier",
    type: "text",
    showOn: "all",
  },
  {
    name: "batchNumber",
    label: "Batch Number",
    type: "text",
    showOn: "all",
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    showOn: "all",
  },
  // {
  //   name: "created_on",
  //   label: "Created On",
  //   type: "date",
  //   showOn: "view,edit",
  //   disabled: true,
  // },
];
