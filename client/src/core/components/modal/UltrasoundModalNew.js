import React, { useRef, useState, useEffect } from "react";
import { ultrasoundsForm } from "../../constants/medical/ultrasoundPresets";
import { X, XCircle } from "lucide-react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { capitalizeText } from "../../utils/stringUtils";
import jsPDF from "jspdf";

import UltrasoundBiophysicalPrint from "../documents/UltrasoundBiophysical";
import UltrasoundTransvaginalOBPrint from "../documents/UltrasoundTVSOB";
import TransvaginalUltrasoundGynePrint from "../documents/UltrasoundTVSGyne";
import { handleFormDelete } from "../formActions/formHandlers";
import { useDispatch } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import { formatDateForInput } from "../../utils/dateUtils";
import apiService from "../../services/apiService";

// 🔹 Section Title
function SectionTitle({ title }) {
  return (
    <h3 className="col-span-4 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1 mt-4 mb-2">
      {capitalizeText(title)}
    </h3>
  );
}

// Helper function: calculate age from date of birth
const calculateAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// Format date to human-readable
const formatDate = (rawDate) => {
  if (!rawDate) return "";
  const date = new Date(rawDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// 🔹 Input Renderer
function InputField({ field, value, onChange }) {
  if (field.type === "break") {
    return <div className="col-span-4"></div>;
  }

  if (field.type === "link" && field.display) {
    return (
      <div className={`col-span-${field.colSpan || 1}`}>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {field.label}
        </label>
        <a
          href={`/form/users/view/${value?._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-words text-sm"
        >
          {value?.name}
        </a>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={`col-span-${field.colSpan || 4}`}>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {field.label}
        </label>
        <textarea
          name={field.name}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
          rows={3}
        />
      </div>
    );
  }

  if (field.type === "select") {
    const SelectComponent = field.creatable ? CreatableSelect : Select;
    return (
      <div className={`col-span-${field.colSpan || 1}`}>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          {field.label}
        </label>
        <SelectComponent
          name={field.name}
          options={field.options || []}
          value={
            field.options?.find((opt) => opt.value === value) ||
            (value ? { label: value, value } : null)
          }
          onChange={(selected) =>
            onChange({
              target: {
                name: field.name,
                value: selected ? selected.value : "",
              },
            })
          }
          className="text-sm"
          isClearable
          placeholder={field.placeholder || "Select..."}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "32px",
              height: "32px",
            }),
            valueContainer: (base) => ({
              ...base,
              height: "32px",
              padding: "0 6px",
            }),
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "32px",
            }),
          }}
        />
      </div>
    );
  }

  return (
    <div className={`col-span-${field.colSpan || 1}`}>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {field.label}
      </label>
      <input
        type={field.type || "text"}
        name={field.name}
        readOnly={field.readOnly}
        placeholder={field.placeholder}
        value={field.type === "date" ? formatDateForInput(value) : value || ""}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
      />
    </div>
  );
}

// 🔹 Ultrasound Form Component
const UltrasoundForm = ({ data = {}, onChange, onSubmit, hasPermission }) => {
  const dispatch = useDispatch();
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    const updated = { ...data };
    let temp = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!temp[keys[i]]) temp[keys[i]] = {};
      temp = temp[keys[i]];
    }
    temp[keys[keys.length - 1]] = value;

    onChange(updated);
  };

  const handleDeleteConfirm = () => {
    handleFormDelete({
      dispatch,
      tablename: "ultrasound",
      id: data._id,
      // navigate,
    });
  };

  return (
    <>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit(data);
        }}
      >
        {Object.entries(ultrasoundsForm).map(
          ([sectionName, sectionConfig], idx) => {
            const { condition, fields } = sectionConfig;

            if (condition && condition.type) {
              if (Array.isArray(condition.type)) {
                if (!condition.type.includes(data.type)) return null;
              } else {
                if (data.type !== condition.type) return null;
              }
            }

            // Sections that should NOT have headers
            const hideHeader = [""].includes(sectionName.toLowerCase());

            return (
              <div key={idx} className="grid grid-cols-4 gap-3">
                {!hideHeader && (
                  <SectionTitle title={sectionName.replace(/_/g, " ")} />
                )}
                {fields.map((field, fIdx) => {
                  // let value = getNestedValue(data, field.name);

                  // Skip field if showOnly condition doesn't match
                  if (
                    field.showOnly &&
                    Array.isArray(field.showOnly) &&
                    !field.showOnly.includes(data.type)
                  ) {
                    return null;
                  }

                  let value = field.name
                    .split(".")
                    .reduce((o, k) => (o ? o[k] : ""), data);

                  // ✅ Apply default if value is empty
                  if (
                    (value === undefined || value === "") &&
                    field.default !== undefined
                  ) {
                    if (typeof field.default === "function") {
                      value = field.default(); // e.g. dynamic defaults like "new Date()"
                    } else {
                      value = field.default;
                    }
                  }

                  return (
                    <InputField
                      key={fIdx}
                      field={field}
                      value={value}
                      disabled={hasPermission}
                      onChange={handleChange}
                    />
                  );
                })}
              </div>
            );
          }
        )}

        {/* Submit button */}
        <div className="flex justify-end mt-3  gap-2">
          {hasPermission && data._id && (
            <button
              type="button"
              onClick={() => {
                setModalConfig({
                  title: "Confirm Delete",
                  description: "Are you sure you want to delete this data?",
                  confirmText: "Delete",
                  confirmColor: "bg-red-600",
                  icon: <XCircle className="w-5 h-5 text-red-600" />,
                  onConfirm: handleDeleteConfirm,
                }) || setIsModalOpen(true);
                // onClose();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Delete
            </button>
          )}
          {hasPermission && (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {data && data._id ? "Update" : "Submit"}
            </button>
          )}
        </div>
      </form>
      {/* Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </>
  );
};

// 🔹 Modal Wrapper
export default function UltrasoundModalNew({
  isOpen,
  onClose,
  title,
  hasPermission,
  initialData = {},
  onSave,
  patient,
  doctor,
}) {
  const usRef = useRef(); // ✅ new ref for ultrasound
  const dispatch = useDispatch();

  // console.log(initialData);

  const [data, setData] = useState({
    ...initialData,
    doctor: doctor || {},
    patient: patient || {}, // ✅ ensure patient gets injected

    // Fetal Survey
    fetal_survey: {
      presentation: "",
      fetal_sex: "",
      number_of_fetus: "",
      placenta_grade: "",
      placenta_position: "",
      fetal_heart_rate: "",
      amniotic_fluid: {
        svp: "",
        afi: {
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          total: "",
        },
      },
      ...(initialData?.fetal_survey || {}),
    },

    // Early Pregnancy
    early_pregnancy: {
      gestational_sac: { size: "", age_equiv: "" },
      crown_rump_length: { size: "", age_equiv: "" },
      yolk_sac: "",
      fetal_heart_rate: "",
      average_ultrasonic_age: "",
      ultrasonic_edc: "",
      uterus: "",
      adnexae: { right_ovary: "", left_ovary: "", notes: "" },
      cervix: { dimensions: "", volume: "", notes: "" },
      ...(initialData?.early_pregnancy || {}),
    },

    // Gyn Findings
    gyn_findings: {
      cervix: { dimensions: "", notes: "" },
      uterus: {
        dimensions: "",
        orientation: "",
        notes: "",
        wall_thickness: { anterior: "", posterior: "" },
      },
      endometrium: { thickness: "", notes: "" },
      right_ovary: { dimensions: "", volume: "", notes: "" },
      left_ovary: { dimensions: "", volume: "", notes: "" },
      others: { notes: "" },
      ...(initialData?.gyn_findings || {}),
    },
  });

  // console.log(data);

  useEffect(() => {
    // 🩺 Auto-load existing pregnancy data if this is an OB ultrasound
    const fetchPregnancyData = async () => {
      if (!data?.patient?._id) return; // patient must be selected first
      try {
        const pregnancies = await apiService.get(dispatch, `pregnancies`, {
          patient: data?.patient?._id,
          status: "active",
        });

        // ✅ Get the first pregnancy (if exists)
        const pregnancy = pregnancies?.[0];
        if (!pregnancy || !pregnancy.lmp) return;

        // ✅ Pre-fill OB-related fields
        setData((prev) => ({
          ...prev,
          ob_data: {
            ...prev.ob_data,
            lmp: pregnancy.lmp ? pregnancy.lmp.slice(0, 10) : "",
            edd: pregnancy.edd ? pregnancy.edd.slice(0, 10) : "",
            aog: pregnancy.aog || "",
            gravida_para: pregnancy.gravida_para || "",
          },
        }));
      } catch (err) {
        console.error("Error fetching pregnancy data:", err);
      }
    };

    fetchPregnancyData();
  }, [dispatch, data?.patient?._id, data?.type]);

  const handlePDFDownload = (ref, fileName) => {
    if (!ref.current) return;
    const doc = new jsPDF("p", "px", "a4");

    // Use html2canvas if you want the HTML content as image
    doc.html(ref.current, {
      callback: function (doc) {
        doc.save(`${fileName}.pdf`);
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.5 },
      margin: 11,
    });
  };

  // console.log(data);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-11/12 max-w-6xl shadow-lg p-5 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-md font-semibold text-gray-800">{title}</h2>
            {data && data._id && (
              <button
                onClick={() =>
                  handlePDFDownload(
                    usRef,
                    `${data.patient?.fullname} - ${data.type}`
                  )
                }
                className="px-4 py-2 rounded-lg bg-blue-50 border text-blue-600 border-blue-100 text-sm"
              >
                🖨️ Ultrasound
              </button>
            )}
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto pr-2 -mr-2 flex-1">
          <UltrasoundForm
            data={data}
            hasPermission={hasPermission}
            onChange={setData}
            onSubmit={(formData) => {
              if (onSave) onSave(formData); // ✅ call parent handleSave
              onClose();
            }}
          />
        </div>

        <div style={{ display: "none" }}>
          {(() => {
            const type = data?.type;

            if (!type) return null;

            switch (type) {
              case "Biometry":
                return (
                  <UltrasoundBiophysicalPrint
                    ref={usRef}
                    data={{
                      ...data,
                      date: formatDate(data.date),
                    }}
                    patient={{
                      ...data.patient,
                      age: calculateAge(data.patient?.date_of_birth),
                    }}
                  />
                );

              case "Biophysical Score":
                return (
                  <UltrasoundBiophysicalPrint
                    ref={usRef}
                    data={{
                      ...data,
                      date: formatDate(data.date),
                    }}
                    patient={{
                      ...data.patient,
                      age: calculateAge(data.patient?.date_of_birth),
                    }}
                  />
                );

              case "Transvaginal Ultrasound - OB":
                return (
                  <UltrasoundTransvaginalOBPrint
                    ref={usRef}
                    data={{
                      ...data,
                      date: formatDate(data.date),
                    }}
                    patient={{
                      ...data.patient,
                      age: calculateAge(data.patient?.date_of_birth),
                    }}
                  />
                );

              case "Transvaginal Ultrasound - Gyne":
                return (
                  <TransvaginalUltrasoundGynePrint
                    ref={usRef}
                    data={{
                      ...data,
                      date: formatDate(data.date),
                    }}
                    patient={{
                      ...data.patient,
                      age: calculateAge(data.patient?.date_of_birth),
                    }}
                  />
                );

              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
