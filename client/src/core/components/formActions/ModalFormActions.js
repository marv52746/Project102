import React, { useState } from "react";
import { CheckCircle, XCircle, Ban, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { handleCompleteAppointment } from "../formActions/formHandlers";
import ConfirmModal from "../modal/ConfirmModal";

/**
 * Footer buttons for Calendar Modal
 * @param {Object} props
 *  - report: current appointment
 *  - onClose: function to close modal
 *  - userRole: optional, restrict buttons based on role
 */
export default function ModalFormActions({ report, onClose, userRole }) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const onComplete = async () => {
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "completed" },
    });
    onClose();
  };

  const onCancel = async () => {
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "cancelled" },
    });
    onClose();
  };

  const onNoShow = async () => {
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "no-show" },
    });
    onClose();
  };

  // Example restriction: only doctor can complete
  const canComplete = userRole === "doctor" && report.status !== "completed";

  return (
    <>
      {report.status !== "cancelled" && (
        <button
          onClick={() => {
            setModalConfig({
              title: "Cancel Appointment",
              description: "Do you want to mark this appointment as cancelled?",
              confirmText: "Confirm",
              confirmColor: "bg-red-600",
              icon: <XCircle className="w-5 h-5 text-red-600" />,
              onConfirm: onCancel,
            }) || setIsModalOpen(true);
            // onClose();
          }}
          className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
        >
          Cancel Appointment
        </button>
      )}

      {/* {report.status !== "no-show" && (
        <button
          onClick={() => {
            setModalConfig({
              title: "Cancel Appointment",
              description: "Do you want to mark this appointment as no-show?",
              confirmText: "Confirm",
              confirmColor: "bg-yellow-500",
              icon: <XCircle className="w-5 h-5 text-yellow-500" />,
              onConfirm: onCancel,
            }) || setIsModalOpen(true);
            // onClose();
          }}
          className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
        >
          No Show
        </button>
      )} */}

      {canComplete && (
        <button
          onClick={() => {
            setModalConfig({
              title: "Mark as Complete",
              description: "Do you want to mark this appointment as completed?",
              confirmText: "Complete",
              confirmColor: "bg-green-600",
              icon: <CheckCircle className="w-5 h-5 text-green-600" />,
              onConfirm: onComplete,
            }) || setIsModalOpen(true);
            // onClose();
          }}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          Complete
        </button>
      )}

      {/* Example: reschedule */}
      {/* <button className="px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2">
        <RefreshCw size={18} />
        Reschedule
      </button> */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </>
  );
}
