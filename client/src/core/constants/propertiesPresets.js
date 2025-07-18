const typeOptions = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "JSON", value: "json" },
  { label: "File", value: "file" },
];

const allFields = [
  { name: "key", label: "Key", type: "text", showOn: "all" },
  { name: "label", label: "Label", type: "text", showOn: "all" },
  { name: "value", label: "Value", type: "text", showOn: "all" },
  {
    name: "type",
    label: "Type",
    type: "select",
    showOn: "all",
    options: typeOptions,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    showOn: "all",
  },

  //   { type: "spacer", showOn: "all" }, // skip one col space (right slot)
  //   { type: "half-spacer", showOn: "all" }, // skip one col space (right slot)
];

/**
 * Get user fields depending on mode.
 * @param {'form' | 'list'} format - 'form' to get form fields, 'list' for table columns
 * @param {'create' | 'edit' | 'view' | 'all'} show - form mode
 * @returns {Array}
 */
export const getPropertyFields = (format = "form", show = "all") => {
  if (format === "list") {
    return allFields;
  }

  return allFields.filter(
    (field) => field.showOn === "all" || field.showOn === show
  );
};
