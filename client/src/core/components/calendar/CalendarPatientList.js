import React, { useState } from "react";

const CalendarPatientList = ({
  title,
  patients,
  statusColor,
  handleOpenModal,
}) => {
  // State to manage whether 'See More' is clicked
  const [showAll, setShowAll] = useState(false);

  if (patients.length === 0) return null;

  // Sort the patients array by forecastDate
  const sortedPatients = [...patients].sort((a, b) => {
    const dateA = new Date(a.forecastDate);
    const dateB = new Date(b.forecastDate);
    return dateA - dateB; // Sort in ascending order (earliest first)
  });

  // Show first 4 patients by default, or all if 'See More' is clicked
  const displayedPatients = showAll
    ? sortedPatients
    : sortedPatients.slice(0, 3);

  return (
    <div className="mb-5">
      <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
        <span>{title}</span>
      </h3>

      <ul className="text-sm text-gray-700">
        {displayedPatients.map((patient, idx) => (
          <li
            key={idx}
            className="flex items-center space-x-4 py-1 px-4 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out"
            onClick={() => handleOpenModal(patient)} // Assume `handleOpenModal` is defined elsewhere
          >
            <div
              className={`w-3 h-3 rounded-full ${statusColor} transition-all duration-300`}
            ></div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {patient.patient_name}
              </span>
              <span className="text-xs text-gray-500">
                {patient.forecastDate}
              </span>
            </div>
          </li>
        ))}
        <li>
          {patients.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:underline py-1 px-4"
            >
              {showAll ? "See Less" : "See More"}
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default CalendarPatientList;
