import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react"; // Icons for status

function CalendarModal({ report, onClose }) {
  if (!report) return null;

  const today = new Date();
  const forecastDate = new Date(report.edd);
  const isCompleted = report.actualBirthDate;
  const isOverdue = !isCompleted && forecastDate < today;
  const isUpcoming = !isCompleted && forecastDate >= today;

  let statusText = "";
  let statusColor = "";
  let StatusIcon = null;

  if (isCompleted) {
    statusText = "Completed";
    statusColor = "bg-green-500";
    StatusIcon = CheckCircle;
  } else if (isOverdue) {
    statusText = "Overdue";
    statusColor = "bg-red-500";
    StatusIcon = XCircle;
  } else if (isUpcoming) {
    statusText = "Upcoming";
    statusColor = "bg-blue-500";
    StatusIcon = Clock; // Clock icon for upcoming events
  }

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        className="bg-white p-8 rounded-lg w-11/12 max-w-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Clock size={24} className="mr-2 text-blue-600" />
          Birth Report Details
        </h2>

        <div className="space-y-6">
          <div className="flex items-center">
            <strong className="text-gray-700 w-1/3">Patient Name:</strong>
            <p className="text-gray-600">{report.patient_name}</p>
          </div>

          <div className="flex items-center">
            <strong className="text-gray-700 w-1/3">Expected Due Date:</strong>
            <p className="text-gray-600">{report.edd}</p>
          </div>

          <div className="flex items-center">
            <strong className="text-gray-700 w-1/3">Actual Birth Date:</strong>
            <p className="text-gray-600">{report.actualBirthDate || "N/A"}</p>
          </div>

          <div className="flex items-center">
            <strong className="text-gray-700 w-1/3">Status:</strong>
            <div
              className={`flex items-center space-x-2 ${statusColor} text-white p-2 rounded-lg w-fit`}
            >
              <StatusIcon size={16} />
              <p>{statusText}</p>
            </div>
          </div>

          <div className="flex items-start">
            <strong className="text-gray-700 w-1/3">Notes:</strong>
            <p className="text-gray-600">
              {report.notes || "No notes available"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
