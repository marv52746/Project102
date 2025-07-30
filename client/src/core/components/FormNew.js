import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch } from "react-redux";
import apiService from "../services/apiService";
import { showNotification } from "../services/slices/notificationSlice";
import { getInputValue, shouldShowField } from "../utils/fieldUtils";
import { renderSpacer } from "./Form Inputs/LabelSpacerInput";
import ReferenceInput from "./Form Inputs/ReferenceInput";
import SelectInput from "./Form Inputs/SelectInput";
import TextareaInput from "./Form Inputs/TextareaInput";
import TextInput from "./Form Inputs/TextInput";

const FormNew = ({ fields }) => {
  const { tablename } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({});
  const [fileData, setFileData] = useState(null);
  const [showPatientSection, setShowPatientSection] = useState(false);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      for (const field of fields) {
        const key = field.name;
        if (!key) continue;

        if (key === "avatar" && fileData) {
          formData.append("avatar", fileData);
          continue;
        }

        let value = inputData[key];
        if (
          (value === undefined || value === "") &&
          field.default !== undefined
        ) {
          value =
            typeof field.default === "function"
              ? field.default()
              : field.default;
        }

        if (field.type === "date") {
          value = new Date(value).toISOString().split("T")[0];
        } else if (field.type === "datetime-local") {
          value = new Date(value).toISOString().slice(0, 16);
        } else if (field.type === "time") {
          value =
            typeof value === "string"
              ? value
              : new Date(value).toTimeString().slice(0, 5);
        }

        if (field.type === "reference" && value && typeof value === "object") {
          value = value._id || value.id || value.value || "";
        }

        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }

      await apiService.post(dispatch, tablename, formData);
      dispatch(
        showNotification({
          message: "Record created successfully!",
          type: "success",
        })
      );
      navigate(`/list/${tablename}`);
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    let parsedValue = value;

    if (type === "file") {
      setFileData(files[0]);
      parsedValue = files[0];
    } else if (type === "checkbox") {
      parsedValue = checked;
    }

    setInputData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  // const handleReferenceChange = (name, value) => {
  //   setInputData((prev) => ({ ...prev, [name]: value }));
  // };
  const handleReferenceChange = (name, value) => {
    if (name === "patient_section_data") {
      const patientFields = fields.filter((f) => f.section === "patient");

      if (value) {
        // Fill patient fields with selected reference value
        const newValues = {};
        patientFields.forEach((field) => {
          if (value[field.name] !== undefined) {
            newValues[field.name] = value[field.name];
          }
        });
        setInputData((prev) => ({ ...prev, ...newValues }));
      } else {
        // Clear patient fields if reference is cleared
        const clearedValues = {};
        patientFields.forEach((field) => {
          clearedValues[field.name] = "";
        });
        setInputData((prev) => ({ ...prev, ...clearedValues }));
      }

      return;
    }

    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      encType="multipart/form-data"
      className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields
          .filter((field) => !field.section || field.section !== "patient")
          .map((field, index) => {
            if (!shouldShowField(field, "create")) return null;
            if (["spacer", "half-spacer", "label"].includes(field.type)) {
              return renderSpacer(field, index);
            }

            const value = getInputValue(inputData, field);

            return (
              <div key={index}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>

                {field.type === "reference" ? (
                  <ReferenceInput
                    field={field}
                    value={value}
                    onChange={handleReferenceChange}
                    dispatch={dispatch}
                  />
                ) : field.type === "select" ? (
                  <SelectInput
                    field={field}
                    value={value}
                    onChange={handleChange}
                  />
                ) : field.type === "textarea" ? (
                  <TextareaInput
                    field={field}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  <TextInput
                    field={field}
                    value={value}
                    onChange={handleChange}
                  />
                )}
              </div>
            );
          })}
      </div>

      {/* TOGGLE PATIENT RECORD SECTION */}

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowPatientSection(!showPatientSection)}
          className="flex items-center text-blue-600 hover:underline text-sm"
        >
          {showPatientSection ? (
            <ChevronUp className="w-4 h-4 mr-1" />
          ) : (
            <ChevronDown className="w-4 h-4 mr-1" />
          )}
          {showPatientSection ? "Hide" : "Show"} User Record Section
        </button>
      </div>

      {showPatientSection && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border-t pt-4">
          {fields
            .filter((field) => field.section === "patient")
            .map((field, index) => {
              if (!shouldShowField(field, "create")) return null;
              if (["spacer", "half-spacer", "label"].includes(field.type)) {
                return renderSpacer(field, index);
              }
              const value = getInputValue(inputData, field);

              return (
                <div key={`patient-${index}`}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>

                  {field.type === "reference" ? (
                    <ReferenceInput
                      field={field}
                      value={value}
                      onChange={handleReferenceChange}
                      dispatch={dispatch}
                    />
                  ) : field.type === "select" ? (
                    <SelectInput
                      field={field}
                      value={value}
                      onChange={handleChange}
                    />
                  ) : field.type === "textarea" ? (
                    <TextareaInput
                      field={field}
                      value={value}
                      onChange={handleChange}
                    />
                  ) : (
                    <TextInput
                      field={field}
                      value={value}
                      onChange={handleChange}
                    />
                  )}
                </div>
              );
            })}
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
        >
          <Edit className="mr-2" />
          Submit
        </button>
      </div>
    </form>
  );
};

export default FormNew;
