import React from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Ban,
  HelpCircle,
} from "lucide-react";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

function CalendarModal({ report, onClose }) {
  if (!report) return null;

  // Determine status
  const statusMap = {
    completed: {
      text: "Completed",
      color: "bg-green-500",
      icon: CheckCircle,
    },
    scheduled: {
      text: "Scheduled",
      color: "bg-blue-500",
      icon: Clock,
    },
    cancelled: {
      text: "Cancelled",
      color: "bg-red-500",
      icon: XCircle,
    },
    "no-show": {
      text: "No Show",
      color: "bg-yellow-500",
      icon: Ban,
    },
    rescheduled: {
      text: "Rescheduled",
      color: "bg-purple-500",
      icon: RefreshCw,
    },
  };

  const statusDetails = statusMap[report.status] || {
    text: "Unknown",
    color: "bg-gray-400",
    icon: HelpCircle,
  };

  const StatusIcon = statusDetails.icon;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg w-11/12 max-w-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <Clock size={24} className="mr-2 text-blue-600" />
          Appointment Details
        </h2>

        <div className="space-y-4">
          <Detail label="Appointment No." value={report.appointment_no} />
          <Detail label="Patient" value={report.patient_name || "N/A"} />
          <Detail label="Doctor" value={report.doctor_name || "N/A"} />
          <Detail label="Date" value={formatDate(report.date)} />
          <Detail label="Time" value={formatTime(report.time)} />
          <Detail label="Reason" value={report.reason || "N/A"} />
          <Detail label="Notes" value={report.notes || "No notes available"} />

          <div className="flex items-center">
            <strong className="text-gray-700 w-1/3">Status:</strong>
            <div
              className={`flex items-center gap-2 ${statusDetails.color} text-white px-3 py-1 rounded-md`}
            >
              <StatusIcon size={16} />
              <span>{statusDetails.text}</span>
            </div>
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

const Detail = ({ label, value }) => (
  <div className="flex items-start">
    <strong className="text-gray-700 w-1/3">{label}:</strong>
    <p className="text-gray-600">{value}</p>
  </div>
);

export default CalendarModal;
