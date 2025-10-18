import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Ban,
  HelpCircle,
  Baby,
} from "lucide-react";
import { capitalizeText } from "../../utils/stringUtils";
import UltrasoundModalNew from "../modal/UltrasoundModalNew";
import { useDispatch, useSelector } from "react-redux";
import { adminOnlyRoles } from "../../constants/rolePresets";
import { handleUltrasoundSubmit } from "../formActions/handleUltrasoundSubmit";

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
  const currentUser = useSelector((state) => state.user.userInfo);
  const hasPermission = adminOnlyRoles.includes(currentUser.role);

  const [ultrasoundReport, setUltrasoundReport] = useState(null);
  const dispatch = useDispatch();

  const handleSave = async (type, data) => {
    await handleUltrasoundSubmit({
      dispatch,
      data,
    });
  };

  // console.log(report);
  if (!report) return null;

  // Determine status
  const statusMap = {
    completed: {
      text: "Completed",
      color: "bg-green-500",
      icon: CheckCircle,
    },
    active: {
      text: "Active",
      color: "bg-pink-500",
      icon: Baby,
    },
    delivered: {
      text: "Delivered",
      color: "bg-green-500",
      icon: CheckCircle,
    },
    scheduled: {
      text: "Scheduled",
      color: "bg-blue-500",
      icon: Clock,
    },
    ready: {
      text: "Ready",
      color: "bg-green-500",
      icon: Clock,
    },
    cancelled: {
      text: "Cancelled",
      color: "bg-gray-400",
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
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 "
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-2xl w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5 max-w-[900px] shadow-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {report.appointment_no && (
          <>
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
              <Detail
                label="Notes"
                value={report.notes || "No notes available"}
              />

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
          </>
        )}

        {/* EDD / Pregnancy Section */}
        {report.edd && (
          <>
            <h2 className="text-2xl font-semibold text-pink-600 mb-4 flex items-center">
              <Baby size={24} className="mr-2 " />
              Pregnancy Details
            </h2>

            <div className="mt-8 border-t pt-6 space-y-4">
              <div className="flex items-start">
                <strong className="text-gray-700 w-1/3">Patient:</strong>
                <a
                  href={`/form/patients/view/${report.patient._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 no-underline"
                >
                  {report.patient.fullname}
                </a>
              </div>
              <Detail
                label="Expected Due Date"
                value={formatDate(report.edd)}
              />
              <Detail
                label="Gravida / Para"
                value={report.gravida_para ?? "N/A"}
              />
              <Detail label="LMP" value={formatDate(report.lmp)} />
              <Detail label="AOG" value={report.aog ?? "N/A"} />
              <Detail label="Status" value={capitalizeText(report.status)} />

              {report.ultrasound?._id && (
                <div className="flex items-start">
                  <strong className="text-gray-700 w-1/3">Ultrasound:</strong>
                  <button
                    onClick={() =>
                      setUltrasoundReport({
                        ...report.ultrasound,
                        patient: report.patient, // ✅ Correct way to attach patient
                      })
                    }
                    className="text-blue-600 no-underline"
                  >
                    {report.ultrasound.type}
                  </button>
                </div>
              )}

              <Detail
                label="Notes"
                value={report.notes || "No pregnancy notes available"}
              />
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {ultrasoundReport && (
        <UltrasoundModalNew
          title={"Ultrasound Data"}
          isOpen={ultrasoundReport}
          hasPermission={hasPermission}
          onClose={() => setUltrasoundReport(null)}
          onSave={(data) => handleSave("ultrasound", data)}
          initialData={ultrasoundReport} // empty array
          patient={ultrasoundReport.patient}
        />
      )}
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
