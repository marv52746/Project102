/**
 * Returns appropriate appointment fields for either list view or form based on mode.
 *
 * @param {Array<Object>|null} tableColumn - Table column definitions (used for list view). If provided, it's returned directly.
 * @param {Array<Object>} formFields - Form field definitions (used for create/edit/view modes).
 * @param {'create' | 'edit' | 'view' | 'all'} mode - The mode to filter form fields by.
 * @returns {Array<Object>} - The filtered list of fields based on the mode.
 */
export const getFields = (tableColumn, formFields) => {
  if (tableColumn) {
    return tableColumn;
  } else {
    return formFields;
  }
};

export const shouldShowField = (field, view) => {
  const showOn = (field.showOn || "all").split(",").map((s) => s.trim());
  return showOn.includes("all") || showOn.includes(view);
};

export const getInputValue = (inputData, field) => {
  let val = inputData[field.name];

  const isEmpty = val === undefined || val === null || val === "";

  // If value is empty, use default
  if (isEmpty) {
    val = field.default;

    if (val === undefined || val === null || val === "") {
      return ""; // Still no usable value
    }
  }

  if (field.type === "date") {
    return new Date(val).toISOString().split("T")[0]; // "YYYY-MM-DD"
  }

  if (field.type === "datetime-local") {
    return new Date(val).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }

  if (field.type === "time") {
    return typeof val === "string"
      ? val
      : new Date(val).toTimeString().slice(0, 5); // "HH:MM"
  }

  return val;
};
