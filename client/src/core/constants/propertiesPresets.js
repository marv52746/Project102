const typeOptions = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "JSON", value: "json" },
  { label: "File", value: "file" },
];

export const propertyAllFields = [
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
