// Utility function to format paths (remove leading slash, capitalize first letter, handle hyphens)
export const formatPath = (path) => {
  return path
    .replace(/^\/+/, "") // Remove leading slashes
    .split("-") // Split by hyphen (in case there are multiple words)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" "); // Join back into a single string with spaces
};
