/**
 * Returns Tailwind CSS classes for status badges.
 * Uses soft background with matching text color to resemble pastel tags.
 *
 * @param {string} status - The status string to evaluate.
 * @returns {string} Tailwind classes for badge styling.
 */
export const getStatusClass = (status) => {
  const normalized = status?.toLowerCase();

  const statusMap = {
    completed: "bg-green-100 text-green-600",
    cancelled: "bg-gray-100 text-gray-600",
    "no-show": "bg-yellow-100 text-yellow-700",
    rescheduled: "bg-purple-100 text-purple-600",
    scheduled: "bg-blue-100 text-blue-600",
  };

  const roleMap = {
    admin: "bg-blue-100 text-blue-600",
    doctor: "bg-green-100 text-green-600",
    staff: "bg-red-100 text-red-600",
    patient: "bg-yellow-100 text-yellow-700",
    guest: "bg-purple-100 text-purple-600",
  };

  return (
    statusMap[normalized] || roleMap[normalized] || "bg-blue-100 text-blue-600"
  );
};
