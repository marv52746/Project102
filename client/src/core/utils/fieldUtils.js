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
  console.log(field.showOn);
  const showOn = (field.showOn || "all").split(",").map((s) => s.trim());
  return showOn.includes("all") || showOn.includes(view);
};
