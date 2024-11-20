// Utility function to format paths (remove leading slash, capitalize first letter, handle hyphens)
export const formatPath = (path) => {
  if (!path) return "";

  return path
    .replace(/^\/+/, "") // Remove leading slashes
    .split("-") // Split by hyphen (in case there are multiple words)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" "); // Join back into a single string with spaces
};

// Utility function to get a formatted view title based on table name and view type
const getFormattedView = (tablename, view) => {
  const viewTitles = {
    patients: {
      view: "Patient Details",
      edit: "Edit Patient",
      create: "Create Patient",
    },
    doctors: {
      view: "Doctor Details",
      edit: "Edit Doctor",
      create: "Create Doctor",
    },
    appointments: {
      view: "Appointment Details",
      edit: "Edit Appointment",
      create: "Create Appointment",
    },
    payments: {
      view: "Payment Details",
      edit: "Edit Payment",
      create: "Create Payment",
    },
  };

  // Return the formatted view title based on the tablename and view
  return viewTitles[tablename]?.[view] || null;
};

// Function to extract parameters from the path
export const getParmsFromPath = (location) => {
  if (!location) return null;

  const params = {
    tablename: null,
    view: null,
    id: null,
  };

  const path = location.pathname.split("/"); // Split path into segments

  // Handle root path (empty first segment)
  if (path[1] === "") {
    params.tablename = "dashboard";
    return params;
  }

  // Handle "list" and "form" segments
  if (path[1] === "list" || (path[1] === "form" && path[2])) {
    params.tablename = path[2];
    params.view = getFormattedView(path[2], path[3]);
    params.id = path[4];
    return params;
  }

  // Handle paths with just a single table name
  params.tablename = path[1];
  return params; // Return first path
};

export const generateRandomData = (num) => {
  const statuses = ["Completed", "Pending", "Cancelled"];
  return Array.from({ length: num }, (_, index) => ({
    id: index + 1,
    name: `Patient ${index + 1}`,
    age: 20 + (index % 30),
    phone: `1234-567-${Math.floor(Math.random() * 900) + 100}`,
    lastVisit: `${Math.floor(Math.random() * 30) + 1}-0${
      Math.floor(Math.random() * 12) + 1
    }-2023`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};
