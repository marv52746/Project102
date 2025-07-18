export const getStatusClass = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-gray-400 text-white";
    case "no-show":
      return "bg-red-500 text-white";
    case "rescheduled":
      return "bg-yellow-400 text-white";
    default:
      return "bg-blue-500 text-white"; // scheduled
  }
};
