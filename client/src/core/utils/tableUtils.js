// Helper to get nested value like "patient.name"
export const getNestedValue = (obj, path) => {
  const value = path.split(".").reduce((acc, key) => acc?.[key], obj);

  if (value == null) return; // null or undefined

  // Format ISO date strings
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    return date.toLocaleDateString("en-CA"); // format as YYYY-MM-DD
  }

  // Render .name from reference object
  if (typeof value === "object") {
    return value.name || "[Object]";
  }
  return value;
};
