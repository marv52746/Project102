import React from "react";
import { CheckCircle, X, User, Stethoscope } from "lucide-react";
import { useDispatch } from "react-redux";
import { handleCompleteAppointment } from "../formActions/formHandlers";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { capitalizeText } from "../../utils/stringUtils";
import ModalFormActions from "../formActions/ModalFormActions";

function CalendarModalDetails({ report, onClose }) {
  const dispatch = useDispatch();
  if (!report) return null;

  const onComplete = async () => {
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "completed" },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-11/12 max-w-2xl shadow-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Appointment #{report.appointment_no}
            </h2>
            <p className="text-sm text-gray-500">
              {formatDate(report.date)} at {formatTime(report.time)}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              icon={User}
              label="Patient"
              value={report.patient?.name || "N/A"}
            />
            <InfoCard
              icon={Stethoscope}
              label="Doctor"
              value={report.doctor?.name || "N/A"}
            />
            <InfoCard label="Reason" value={report.reason || "N/A"} />
            <InfoCard
              label="Status"
              value={capitalizeText(report.status) || "N/A"}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-4 bg-gray-50">
          <ModalFormActions
            report={report}
            onClose={onClose}
            userRole={"doctor"}
          />
        </div>
      </div>
    </div>
  );
}

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {Icon && <Icon size={14} className="text-gray-500" />}
      {label}
    </span>
    <span className="text-gray-800 mt-1">{value}</span>
  </div>
);

export default CalendarModalDetails;
