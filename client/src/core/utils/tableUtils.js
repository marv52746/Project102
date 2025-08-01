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

/**
 * Formats a date string into "Month Day, Year" (e.g., January 20, 2025).
 *
 * @param {string|Date} dateInput - The input date as a string or Date object.
 * @returns {string} Formatted date string.
 */
export const formatFullDate = (dateInput) => {
  if (!dateInput) return "-";

  const date = new Date(dateInput);
  if (isNaN(date)) return "-";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Optional utility to calculate age
export const getAge = (birthDate) => {
  if (!birthDate) return null;
  const dob = new Date(birthDate);
  if (isNaN(dob)) return null;

  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};
