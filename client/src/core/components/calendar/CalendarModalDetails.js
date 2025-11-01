import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Stethoscope,
  Scissors,
  NotebookText,
  Check,
  Gauge,
  HeartPulse,
  Thermometer,
  Weight,
  Activity,
  FlaskConical,
  ImageIcon,
  Syringe,
  FileText,
  XIcon,
  Pencil,
} from "lucide-react";

import { formatDate } from "../../utils/dateUtils";
import { capitalizeText } from "../../utils/stringUtils";
import ModalFormActions from "../formActions/ModalFormActions";
import {
  AllergiesModal,
  ConditionsModal,
  FindingsModal,
  LabRequestModal,
  PrescriptionModal,
  SurgeriesModal,
  VitalsModal,
} from "../modal/BaseModal";
import { clinicalFormFieldMap } from "../../constants/medical/clinicalPresets";
import { useDispatch, useSelector } from "react-redux";
import { handleFormSubmit } from "../formActions/formSubmit";
import apiService from "../../services/apiService";
import VitalItem from "./VitalItem";
import PrintActionButtons from "../documents/PrintCertificate";
import UltrasoundModalNew from "../modal/UltrasoundModalNew";
import { adminOnlyRoles } from "../../constants/rolePresets";
import { handleUltrasoundSubmit } from "../formActions/handleUltrasoundSubmit";
import useAppointmentSocket from "../../hooks/useAppointmentSocket";

function CalendarModalDetails({ report: initialReport, onClose }) {
  const [report, setReport] = useState(initialReport);
  const [activeModal, setActiveModal] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasPermission = adminOnlyRoles.includes(userInfo.role);

  // console.log(report);

  const dispatch = useDispatch();

  useAppointmentSocket((data) => {
    const updatedData = data.data;
    setReport((prevReport) => ({
      ...prevReport, // keep all previous fields
      ...updatedData, // overwrite updated fields
      patient: prevReport.patient, // preserve patient
      doctor: prevReport.doctor, // preserve doctor
    }));
  });

  // console.log(report);

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

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
      case "surgery":
        return "surgical";
      case "pregnancies":
        return "pregnancy";
      case "vitals":
        return "vitals";
      case "labrequest":
        return "labrequest";
      default:
        return type;
    }
  };

  const handleSave = async (type, data) => {
    const records = Array.isArray(data) ? data : [data];
    const fields = (clinicalFormFieldMap[type] || []).filter((f) => f.name);
    // console.log(data);
    // console.log(fields);

    if (type === "appointments") {
      const appointmentData = records[0];

      const updatedAppointment = await apiService.put(
        dispatch,
        "appointments",
        report._id,
        appointmentData
      );
      // If diagnosis is provided, also save condition
      if (updatedAppointment.diagnosis) {
        const conditionData = {
          name: updatedAppointment.diagnosis,
          notes: updatedAppointment.notes,
          diagnosed_date: updatedAppointment.date,
          appointment: updatedAppointment, // reference the appointment
          patient: updatedAppointment.patient,
        };

        // 1. Check if condition exists for this appointment
        const existingConditions = await apiService.get(
          dispatch,
          "conditions",
          {
            appointment: updatedAppointment._id,
          }
        );

        if (existingConditions?.length > 0) {
          // 2. Update existing condition
          await apiService.put(
            dispatch,
            "conditions",
            existingConditions[0]._id,
            conditionData
          );
        } else {
          // 3. Create new condition
          await apiService.post(dispatch, "conditions", conditionData);
        }
      }
    }

    if (type !== "appointments") {
      const enrichedRecords = records.map((record) => ({
        ...record,
        patient: report.patient || null,
        appointment: report || null,
      }));

      // save in batch
      let savedRecords;
      if (type !== "ultrasound") {
        savedRecords = await Promise.all(
          enrichedRecords.map((rec) => {
            if (rec._id) {
              // update existing
              return handleFormSubmit({
                dispatch,
                tablename: type,
                data: rec,
                id: rec._id,
                fields,
                // skipGlobalRefresh: true,
              });
            } else {
              // create new
              return handleFormSubmit({
                dispatch,
                tablename: type,
                data: rec,
                fields,
                // skipGlobalRefresh: true,
              });
            }
          })
        );
      } else {
        const savedUltrasound = await handleUltrasoundSubmit({
          dispatch,
          appointmentData: report,
          data,
          patient: report.patient,
          doctor: report.doctor,
          onClose: () => setActiveModal(null),
          // onRefresh,
        });

        savedRecords = [savedUltrasound]; // ✅ wrap in array for consistency
      }

      const existingList = Array.isArray(
        report[mapTypeToAppointmentField(type)]
      )
        ? report[mapTypeToAppointmentField(type)]
        : [];

      const updatedList = [
        ...existingList.filter(
          (oldRec) => !savedRecords.some((newRec) => newRec._id === oldRec._id)
        ),
        ...savedRecords,
      ];

      // ✅ Use mapped field
      const appointmentUpdate = {
        [mapTypeToAppointmentField(type)]: updatedList.map((r) => r._id),
      };

      await apiService.put(
        dispatch,
        "appointments",
        report._id,
        appointmentUpdate
      );
    }

    const updatedReport = await apiService.get(
      dispatch,
      `appointments/${report._id}`
    );
    setReport(updatedReport);

    // if (onRefresh) onRefresh();
    setActiveModal(null);
  };

  const handleRedirect = (id, table) => {
    if (id) window.open(`/form/${table}/view/${id}`, "_blank");
  };

  const handleActionClick = (type) => {
    setActiveModal(type);
  };

  const getActionIconProps = (type) => {
    // console.log(report);
    // console.log(type);
    let hasRecord = report[mapTypeToAppointmentField(type)]?.length > 0;
    if (type === "findings") {
      hasRecord = !!report.diagnosis ? true : false;
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
          Icon: Syringe,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "condition":
        return {
          Icon: Stethoscope,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "allergy":
        return {
          Icon: HeartPulse,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      // case "pregnancy":
      //   return {
      //     Icon: Baby,
      //     bgColor: "bg-blue-100",
      //     iconColor: "text-blue-600",
      //     borderColor: "border-gray-200",
      //   };
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
      case "vitals":
        return {
          Icon: Activity,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "labrequest":
        return {
          Icon: FlaskConical,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      case "ultrasound":
        return {
          Icon: ImageIcon,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
      default:
        return {
          Icon: FileText,
          bgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          borderColor: "border-gray-200",
        };
    }
  };

  const actionTypes = [
    {
      type: "vitals",
      title: "Vitals",
      desc: "Record patient vital signs",
    },
    {
      type: "prescription",
      title: "Prescription",
      desc: "Record prescribed medicines",
    },
    {
      type: "findings",
      title: "Diagnosis",
      desc: "Add clinical notes and diagnosis",
    },
    // {
    //   type: "condition",
    //   title: "Condition",
    //   desc: "Record medical conditions and diagnosis",
    // },

    // {
    //   type: "pregnancy",
    //   title: "Pregnancy",
    //   desc: "Record pregnancy details",
    // },

    {
      type: "labrequest",
      title: "Laboratory Request",
      desc: "Record requested laboratory tests",
    },
    {
      type: "ultrasound",
      title: "Ultrasound",
      desc: "Record ultrasound results",
    },
    {
      type: "surgery",
      title: "Surgery",
      desc: "Record surgical history",
    },
    {
      type: "allergy",
      title: "Allergy",
      desc: "Record patient allergies",
    },
  ];

  const visibleActionTypes =
    userInfo.role === "staff"
      ? actionTypes.filter((a) => a.type === "vitals")
      : actionTypes;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-11/12 max-w-3xl shadow-xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between p-4 border-b">
          {/* Left side: Appointment */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Appointment Details
            </h2>
            <p className="px-6 pb-2 text-sm text-gray-500">
              {formatDate(report.date)} - {report.time}
            </p>

            {/* Print buttons */}
            <PrintActionButtons data={report} />
          </div>

          {/* Right side: Close */}
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* VITALS */}
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {report.vitals.length > 0 ? (
              <>
                <VitalItem
                  icon={Gauge}
                  label="Blood Pressure"
                  value={report.vitals[0].blood_pressure}
                  type="bp"
                />
                <VitalItem
                  icon={HeartPulse}
                  label="Heart Rate"
                  value={report.vitals[0].heart_rate}
                  type="hr"
                />
                <VitalItem
                  icon={Thermometer}
                  label="Temperature"
                  value={report.vitals[0].temperature}
                  type="temp"
                />
                <VitalItem
                  icon={Weight}
                  label="Weight"
                  value={report.vitals[0].weight}
                  height={report.vitals[0].height}
                  type="weight"
                />
              </>
            ) : (
              <p className="col-span-full text-center text-gray-400">
                No vitals available.
              </p>
            )}
          </ul>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-4">
            <InfoCard
              icon={User}
              label="Patient"
              value={
                report.patient?.name
                  ? report.patient?.name
                  : report.patient?.fullname || "N/A"
              }
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
              label="Consultation Fee"
              value={report.amount}
              editable={true}
              onSave={(newValue) =>
                handleSave("appointments", { amount: newValue })
              }
            />
            <InfoCard
              label="Status"
              value={capitalizeText(report.status) || "N/A"}
              status={report.status}
            />
            <InfoCard label="Diagnosis" value={report.diagnosis || "-"} />
            <InfoCard label="Reason" value={report.reason || "N/A"} fullWidth />
            <InfoCard
              label="Notes"
              value={report.notes || "-"}
              editable={true}
              onSave={(newValue) =>
                handleSave("appointments", { notes: newValue })
              }
              fullWidth
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {visibleActionTypes.map(({ type, title, desc }) => {
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
          {(report.status === "scheduled" ||
            report.status === "ready" ||
            report.status === "in-progress") && (
            <ModalFormActions
              setError
              report={report}
              onClose={onClose}
              userRole={"doctor"}
              // onRefresh={onRefresh}
            />
          )}
        </div>
        {/* Modals */}
        <PrescriptionModal
          status={report.status}
          isOpen={activeModal === "prescription"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("medications", data)}
          initialData={report.medication}
        />
        <ConditionsModal
          status={report.status}
          isOpen={activeModal === "condition"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("conditions", data)}
          initialData={report.condition}
        />
        <AllergiesModal
          status={report.status}
          isOpen={activeModal === "allergy"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("allergies", data)}
          initialData={report.allergy}
        />
        {/* <PregnanciesModal
          status={report.status}
          isOpen={activeModal === "pregnancy"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("pregnancies", data)}
          initialData={report.pregnancy}
        /> */}
        <SurgeriesModal
          status={report.status}
          isOpen={activeModal === "surgery"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("surgeries", data)}
          initialData={report.surgical}
        />
        <FindingsModal
          status={report.status}
          isOpen={activeModal === "findings"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("appointments", data)}
          initialData={report.notes || report.diagnosis ? [report] : [{}]}
        />
        <VitalsModal
          status={report.status}
          isOpen={activeModal === "vitals"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("vitals", data)}
          initialData={report.vitals} // empty array
        />
        <LabRequestModal
          status={report.status}
          isOpen={activeModal === "labrequest"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("labrequest", data)}
          initialData={report.labrequest} // empty array
        />
        <UltrasoundModalNew
          title={"Ultrasound Data"}
          status={report.status}
          hasPermission={hasPermission}
          isOpen={activeModal === "ultrasound"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("ultrasound", data)}
          initialData={report.ultrasound[0]} // empty array
          patient={report.patient}
          doctor={report.doctor}
        />
      </div>
    </div>
  );
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
  onClick,
  clickable,
  status,
  editable,
  onSave,
  fullWidth,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const userInfo = useSelector((state) => state.user.userInfo);
  const hasPermission = adminOnlyRoles.includes(userInfo.role);

  // console.log(hasPermission);

  const statusBadgeClasses = (s) => {
    switch (s) {
      case "ready":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave && tempValue !== value) onSave(tempValue);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (label !== "Notes" && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  // console.log(tempValue);

  const displayValue =
    label === "Consultation Fee" && !isEditing
      ? `₱ ${Number(value).toLocaleString() ?? "0"}`
      : value ?? "N/A";

  return (
    <div
      className={`flex flex-col ${
        fullWidth ? "col-span-full" : "" // ✅ apply full row span
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {Icon && <Icon size={14} className="text-gray-500" />}
          {label}
          {editable && !isEditing && hasPermission && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Edit"
            >
              <Pencil size={16} strokeWidth={2.2} className="ml-1" />
            </button>
          )}
        </span>

        {editable && isEditing && hasPermission && (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-700"
              title="Save"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Cancel"
            >
              <XIcon size={14} />
            </button>
          </div>
        )}
      </div>

      <span className="mt-1">
        {status ? (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(
              status
            )}`}
          >
            {displayValue}
          </span>
        ) : isEditing ? (
          // <input
          //   type={label === "Consultation Fee" ? "number" : "text"}
          //   autoFocus
          //   value={tempValue}
          //   onChange={(e) => setTempValue(e.target.value)}
          //   onKeyDown={handleKeyDown}
          //   className="border rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring focus:ring-blue-200"
          // />
          label === "Notes" ? (
            <textarea
              autoFocus
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border rounded-md px-2 py-1 text-sm w-full h-20 resize-none focus:outline-none focus:ring focus:ring-blue-200"
            />
          ) : (
            <input
              type={label === "Consultation Fee" ? "number" : "text"}
              autoFocus
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border rounded-md px-2 py-1 text-sm w-full focus:outline-none focus:ring focus:ring-blue-200"
            />
          )
        ) : (
          <span
            onClick={clickable ? onClick : undefined}
            className={`${
              clickable
                ? "text-blue-600 hover:underline hover:text-blue-800 cursor-pointer"
                : "text-gray-800"
            }`}
          >
            {displayValue}
          </span>
        )}
      </span>
    </div>
  );
};

export default CalendarModalDetails;
