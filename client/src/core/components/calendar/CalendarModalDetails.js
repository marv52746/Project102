import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Stethoscope,
  FilePlus2,
  ClipboardList,
  Baby,
  Scissors,
  NotebookText,
  Check,
} from "lucide-react";

import { formatDate, formatTime } from "../../utils/dateUtils";
import { capitalizeText } from "../../utils/stringUtils";
import ModalFormActions from "../formActions/ModalFormActions";
import {
  AllergiesModal,
  ConditionsModal,
  FindingsModal,
  PregnanciesModal,
  PrescriptionModal,
  SurgeriesModal,
} from "../modal/BaseModal";
import { clinicalFormFieldMap } from "../../constants/medical/clinicalPresets";
import { useDispatch } from "react-redux";
import { handleFormSubmit } from "../formActions/formSubmit";
import apiService from "../../services/apiService";

function CalendarModalDetails({ report: initialReport, onClose, onRefresh }) {
  const [report, setReport] = useState(initialReport);
  const [activeModal, setActiveModal] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

  // console.log(report);

  if (!report) return null;

  const mapTypeToAppointmentField = (type) => {
    switch (type) {
      case "medications":
      case "prescription":
        return "medication";
      case "allergies":
        return "allergy";
      case "conditions":
        return "condition";
      case "surgeries":
        return "surgical";
      case "pregnancies":
        return "pregnancy";
      case "vitals":
        return "vitals";
      default:
        return type;
    }
  };

  const handleSave = async (type, data) => {
    const records = Array.isArray(data) ? data : [data];
    const fields = (clinicalFormFieldMap[type] || []).filter((f) => f.name);

    for (const record of records) {
      const enrichedRecord = {
        ...record,
        patient: report.patient || null,
        appointment: report || null,
      };

      const savedRecord = await handleFormSubmit({
        dispatch,
        tablename: type,
        data: enrichedRecord,
        id: type === "appointments" ? report._id : null,
        fields,
      });

      // Update appointment with new record ID
      const appointmentUpdate = {
        [mapTypeToAppointmentField(type)]: [
          ...(report[mapTypeToAppointmentField(type)] || []),
          savedRecord._id,
        ],
      };
      await apiService.put(
        dispatch,
        "appointments",
        report._id,
        appointmentUpdate
      );
    }

    // Fetch updated appointment from backend
    const updatedReport = await apiService.get(
      dispatch,
      `appointments/${report._id}`
    );
    setReport(updatedReport);

    if (onRefresh) onRefresh();
    setActiveModal(null);
  };

  const handleRedirect = (id, table) => {
    if (id) window.open(`/form/${table}/view/${id}`, "_blank");
  };

  const handleActionClick = (type) => {
    setActiveModal(type);
  };

  const getActionIconProps = (type) => {
    let hasRecord = report[mapTypeToAppointmentField(type)]?.length > 0;
    if (type === "findings") {
      hasRecord = report.notes ? true : false;
    }
    if (hasRecord)
      return {
        Icon: Check,
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
        borderColor: "border-green-400",
      };

    switch (type) {
      case "prescription":
        return {
          Icon: FilePlus2,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "condition":
      case "allergy":
        return {
          Icon: ClipboardList,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "pregnancy":
        return {
          Icon: Baby,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "surgery":
        return {
          Icon: Scissors,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "findings":
        return {
          Icon: NotebookText,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      default:
        return {
          Icon: FilePlus2,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
    }
  };

  const actionTypes = [
    {
      type: "prescription",
      title: "Add Prescription",
      desc: "Record prescribed medicines",
    },
    {
      type: "condition",
      title: "Add Condition",
      desc: "Record medical conditions",
    },
    { type: "allergy", title: "Add Allergy", desc: "Record allergies" },
    {
      type: "pregnancy",
      title: "Add Pregnancy",
      desc: "Record pregnancy details",
    },
    { type: "surgery", title: "Add Surgery", desc: "Record surgical history" },
    {
      type: "findings",
      title: "Add Findings",
      desc: "General findings not covered above",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-11/12 max-w-3xl shadow-xl max-h-[85vh] overflow-y-auto"
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
        <div className="p-6 space-y-10">
          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-4">
            <InfoCard
              icon={User}
              label="Patient"
              value={report.patient?.name || "N/A"}
              onClick={() => handleRedirect(report.patient?._id, "patients")}
              clickable
            />
            <InfoCard
              icon={Stethoscope}
              label="Doctor"
              value={report.doctor?.name || "N/A"}
              onClick={() => handleRedirect(report.doctor?._id, "doctors")}
              clickable
            />
            <InfoCard
              label="Status"
              value={capitalizeText(report.status) || "N/A"}
            />
            <InfoCard label="Reason" value={report.reason || "N/A"} />
            <InfoCard label="Notes" value={report.notes || "-"} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {actionTypes.map(({ type, title, desc }) => {
              const { Icon, bgColor, iconColor, borderColor } =
                getActionIconProps(type);
              return (
                <div
                  key={type}
                  onClick={() => handleActionClick(type)}
                  className={`flex items-start gap-3 p-4 border ${borderColor} rounded-xl shadow-sm hover:shadow-md cursor-pointer transition ${
                    report[mapTypeToAppointmentField(type)]?.length > 0
                      ? "bg-green-50"
                      : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <div className={`p-2 ${bgColor} rounded-lg`}>
                    <Icon className={iconColor} size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t p-4 bg-gray-50">
          <ModalFormActions
            setError
            report={report}
            onClose={onClose}
            userRole={"doctor"}
          />
        </div>

        {/* Modals */}
        <PrescriptionModal
          isOpen={activeModal === "prescription"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("medications", data)}
          initialData={report.medication}
        />
        <ConditionsModal
          isOpen={activeModal === "condition"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("conditions", data)}
          initialData={report.condition}
        />
        <AllergiesModal
          isOpen={activeModal === "allergy"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("allergies", data)}
          initialData={report.allergy}
        />
        <PregnanciesModal
          isOpen={activeModal === "pregnancy"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("pregnancies", data)}
          initialData={report.pregnancy}
        />
        <SurgeriesModal
          isOpen={activeModal === "surgery"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("surgeries", data)}
          initialData={report.surgical}
        />
        <FindingsModal
          isOpen={activeModal === "findings"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("appointments", data)}
          initialData={report.notes ? [{ notes: report.notes }] : [{}]}
        />
        {/* <VitalsModal
          isOpen={activeModal === "vitals"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("vitals", data)}
          initialData={report.vitals} // empty array
        /> */}
      </div>
    </div>
  );
}

const InfoCard = ({ icon: Icon, label, value, onClick, clickable }) => (
  <div
    className={`flex flex-col ${clickable ? "cursor-pointer" : ""}`}
    onClick={onClick}
  >
    <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {Icon && <Icon size={14} className="text-gray-500" />}
      {label}
    </span>
    <span
      className={`mt-1 ${
        clickable
          ? "text-blue-600 hover:underline hover:text-blue-800"
          : "text-gray-800"
      }`}
    >
      {value}
    </span>
  </div>
);

export default CalendarModalDetails;
