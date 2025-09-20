import React, { useEffect, useState } from "react";
import {
  X,
  FilePlus2,
  ClipboardList,
  Baby,
  Scissors,
  NotebookText,
  Check,
  Activity,
} from "lucide-react";

import {
  AllergiesModal,
  ConditionsModal,
  FindingsModal,
  PregnanciesModal,
  PrescriptionModal,
  SurgeriesModal,
  VitalsModal,
} from "../modal/BaseModal";
import { clinicalFormFieldMap } from "../../constants/medical/clinicalPresets";
import { useDispatch } from "react-redux";
import { handleFormSubmit } from "../formActions/formSubmit";
import apiService from "../../services/apiService";
import { setRefreshKey } from "../../services/reducers/utilsReducer";

function ClinicalRecordButtonNew({
  report: initialReport,
  onClose,
  onRefresh,
}) {
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
    // console.log(data);

    if (type === "appointments") {
      await apiService.put(dispatch, "appointments", report._id, data[0]);
    }

    if (type !== "appointments") {
      const enrichedRecords = records.map((record) => ({
        ...record,
        patient: report.patient || null,
        appointment: report || null,
      }));

      // save in batch
      const savedRecords = await Promise.all(
        enrichedRecords.map((rec) => {
          if (rec._id) {
            // update existing
            return handleFormSubmit({
              dispatch,
              tablename: type,
              data: rec,
              id: rec._id,
              fields,
            });
          } else {
            // create new
            return handleFormSubmit({
              dispatch,
              tablename: type,
              data: rec,
              fields,
            });
          }
        })
      );

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

    dispatch(setRefreshKey(Date.now())); // use timestamp so it's always new

    if (onRefresh) onRefresh();
    setActiveModal(null);
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
      case "vitals":
        return {
          Icon: Activity,
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
      type: "vitals",
      title: "Add Vitals",
      desc: "Record vitals",
    },
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
              Add Clinical Record
            </h2>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Content - Quick Actions*/}
        <div className="p-6 space-y-10">
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
        <PregnanciesModal
          status={report.status}
          isOpen={activeModal === "pregnancy"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("pregnancies", data)}
          initialData={report.pregnancy}
        />
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
          initialData={report.notes ? [{ notes: report.notes }] : [{}]}
        />
        <VitalsModal
          status={report.status}
          isOpen={activeModal === "vitals"}
          onClose={() => setActiveModal(null)}
          onSave={(data) => handleSave("vitals", data)}
          initialData={report.vitals} // empty array
        />
      </div>
    </div>
  );
}

export default ClinicalRecordButtonNew;
