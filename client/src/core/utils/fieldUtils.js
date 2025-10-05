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

/**
 * Decide if a field should show based on `showOn` and `condition`
 */
export const shouldShowField = (field, view, inputData = {}) => {
  // 1️⃣ Respect showOn
  if (field.showOn && field.showOn !== "all") {
    const views = field.showOn.split(",").map((v) => v.trim());
    if (!views.includes(view)) return false;
  }

  // 2️⃣ Respect condition
  if (field.condition) {
    // Example: condition === "doctor"
    // Will only show if inputData.role === "doctor"
    const role = inputData.role;
    if (role !== field.condition) return false;
  }

  return true;
};

export const getInputValue = (inputData, field) => {
  if (!field?.name) return "";

  // ✅ Support dot notation for nested fields (e.g., user.first_name)
  const keys = field.name.split(".");
  let val = keys.reduce((acc, key) => (acc ? acc[key] : undefined), inputData);

  const isEmpty = val === undefined || val === null || val === "";

  // If value is empty, use default
  if (isEmpty) {
    val = field.default;

    if (val === undefined || val === null || val === "") {
      return ""; // Still no usable value
    }
  }

  // ✅ Date handling remains the same
  if (field.type === "date") {
    const date = new Date(val);
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  if (field.type === "time") {
    return typeof val === "string"
      ? val
      : new Date(val).toTimeString().slice(0, 5); // "HH:MM"
  }

  return val;
};
