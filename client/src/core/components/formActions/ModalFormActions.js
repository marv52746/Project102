import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Ban,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleCompleteAppointment } from "../formActions/formHandlers";
import ConfirmModal from "../modal/ConfirmModal";

/**
 * Footer buttons for Calendar Modal
 * @param {Object} props
 *  - report: current appointment
 *  - onClose: function to close modal
 *  - userRole: optional, restrict buttons based on role
 */
export default function ModalFormActions({
  report,
  onClose,
  userRole,
  setError,
  onRefresh,
}) {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const userInfo = useSelector((state) => state.user.userInfo);

  // At the top of the component
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

  const reportDate = new Date(report.date); // Assuming report.date exists
  reportDate.setHours(0, 0, 0, 0);

  const isToday = reportDate.getTime() === today.getTime();

  const onComplete = async () => {
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "completed" },
    });
    onClose();
  };

  const onReady = async () => {
    // console.log(report);
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "ready" },
    });
    onRefresh();
    onClose();
  };

  const onInProgress = async () => {
    handleCompleteAppointment({
      dispatch,
      tablename: "appointments",
      id: report._id,
      data: { status: "in-progress" },
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

  const openErrorModal = (message) => {
    setModalConfig({
      title: "Validation Error",
      description: message,
      confirmText: "OK",
      cancelText: "", // hide cancel button
      confirmColor: "bg-red-600",
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      onConfirm: () => setIsModalOpen(false),
      onClose: () => setIsModalOpen(false),
    });
    setIsModalOpen(true);
  };

  // Example restriction: only doctor can complete
  const canComplete =
    userInfo.role === "doctor" && report.status === "in-progress";

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

      {report.status === "scheduled" && isToday && (
        <button
          onClick={() => {
            setModalConfig({
              title: "Mark as Ready",
              description: "Do you want to mark this appointment as ready?",
              confirmText: "Ready",
              confirmColor: "bg-green-600",
              icon: <CheckCircle className="w-5 h-5 text-green-600" />,
              onConfirm: onReady,
            }) || setIsModalOpen(true);
            // onClose();
          }}
          // onClick={async () => {
          // await apiService.put(dispatch, "appointments", report._id, {
          //   status: "ready",
          // });
          // const updatedReport = await apiService.get(
          //   dispatch,
          //   `appointments/${report._id}`
          // );
          // setReport(updatedReport);
          // if (onRefresh) onRefresh();
          // }}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          Mark as Ready
        </button>
      )}

      {report.status === "ready" && (
        <button
          onClick={() => {
            setModalConfig({
              title: "Move to Ongoing Checkup",
              description:
                "Do you want to move this appointment to ongoing checkup?",
              confirmText: "Move to Ongoing",
              confirmColor: "bg-blue-600",
              icon: <RefreshCw className="w-5 h-5 text-blue-600" />,
              onConfirm: onInProgress,
            }) || setIsModalOpen(true);
          }}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Move to Ongoing
        </button>
      )}

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
          Mark as Complete
        </button>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </>
  );
}
