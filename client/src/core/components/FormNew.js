import React, { useEffect, useState } from "react";
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
import PasswordInput from "./Form Inputs/PasswordInput";
import AttachmentInput from "./Form Inputs/AttachmentInput";
import {
  handleInputChange,
  handleReferenceChange,
} from "./formActions/formHandlers";
import { handleFormSubmit } from "./formActions/formSubmit";

const FormNew = ({ fields }) => {
  const { tablename } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({});
  const [fileData, setFileData] = useState(null);
  const [showPatientSection, setShowPatientSection] = useState(true);

  useEffect(() => {
    setInputData((prev) => {
      let changed = false;
      const newData = { ...prev };

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
  }, []); // ✅ only run once on mount

  const handleSubmit = async () => {
    handleFormSubmit({
      dispatch,
      tablename,
      data: inputData,
      fields,
      fileData,
      navigate,
    });
  };

  const handleChange = (e) => {
    handleInputChange({ e, setInputData, setFileData });
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
                    onChange={(name, value) =>
                      handleReferenceChange({
                        name,
                        value,
                        fields,
                        setInputData,
                      })
                    }
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
                ) : field.type === "password" ? (
                  <PasswordInput
                    field={field}
                    value={value}
                    onChange={handleChange}
                  />
                ) : field.type === "file" ? (
                  <AttachmentInput
                    field={field}
                    value={inputData[field.name]}
                    fileData={fileData}
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

      {tablename === "patients" && (
        <>
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
                  // Skip password if user exist
                  if (field.type === "password" && inputData["patient"])
                    return null;

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
                          onChange={(name, value) =>
                            handleReferenceChange({
                              name,
                              value,
                              fields,
                              setInputData,
                            })
                          }
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
                      ) : field.type === "password" ? (
                        <PasswordInput
                          field={field}
                          value={value}
                          onChange={handleChange}
                        />
                      ) : field.type === "file" ? (
                        <AttachmentInput
                          field={field}
                          value={inputData[field.name]}
                          fileData={fileData}
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
        </>
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
