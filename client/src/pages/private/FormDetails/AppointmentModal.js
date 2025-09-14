import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import { useDispatch } from "react-redux";

import { handleInputChange } from "../../../core/components/formActions/formHandlers";
import { capitalizeText } from "../../../core/utils/stringUtils";
import { shouldShowField } from "../../../core/utils/fieldUtils";
import { renderSpacer } from "../../../core/components/Form Inputs/LabelSpacerInput";
import { renderField } from "../../../core/components/Form Inputs/Index";

export default function AppointmentModal({
  onClose,
  patient,
  mode, // create | edit | view
  type,
  data,
  fields,
  patientData,
}) {
  const [inputData, setInputData] = useState(data || {});
  const [fileData, setFileData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setInputData((prev) => {
      let changed = false;
      const newData = { patient: patientData, ...prev };

      // console.log(newData);

      fields.forEach((field) => {
        const hasValue =
          newData[field.name] !== undefined && newData[field.name] !== null;
        if (!hasValue && field.default !== undefined) {
          newData[field.name] =
            typeof field.default === "function"
              ? field.default()
              : field.default;
          changed = true;
        }
      });

      return changed ? newData : prev; // ⛔ prevent setState loop
    });
  }, [fields, patientData]); // ✅ only run once on mount

  const handleChange = (e) => {
    handleInputChange({ e, setInputData, setFileData });
    // console.log(inputData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ stop page reload

    handleFormSubmit({
      dispatch,
      tablename: "appointments",
      // id: patient._id,
      data: inputData,
      fields,
      fileData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {mode === "view" ? "View" : "Add"}{" "}
            {capitalizeText(type?.replace("_", " "))} Record
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field, index) => {
              if (!shouldShowField(field, mode)) return null;
              if (["spacer", "half-spacer", "label"].includes(field.type)) {
                return renderSpacer(field, index);
              }

              // Section label
              if (field.type === "label") {
                return (
                  <div key={index} className="col-span-2">
                    <h3 className="text-md font-semibold text-gray-600 mt-4 mb-2">
                      {field.label}
                    </h3>
                  </div>
                );
              }
              if (!field.name) return null;

              return (
                <div key={index} className={field.fullRow ? "col-span-2" : ""}>
                  {renderField({
                    field,
                    index,
                    inputData,
                    handleChange,
                    setInputData,
                    fields,
                    dispatch,
                  })}
                </div>
              );
            })}
          </div>
          {mode !== "view" && (
            <div className="flex justify-end sticky bottom-0 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
