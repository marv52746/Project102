import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { shouldShowField } from "../utils/fieldUtils";
import { renderSpacer } from "./Form Inputs/LabelSpacerInput";

import { handleInputChange } from "./formActions/formHandlers";
import { handleFormSubmit } from "./formActions/formSubmit";
import { renderField } from "./Form Inputs/Index";
import { adminOnlyRoles } from "../constants/rolePresets";

const FormNew = ({ fields }) => {
  const { tablename, view, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({});
  const [fileData, setFileData] = useState(null);
  const [showSection, setShowSection] = useState(true);

  const currentUser = useSelector((state) => state.user.userInfo);

  const hasUpdateDeletePermission =
    currentUser && adminOnlyRoles.includes(currentUser.role);

  const isViewing = id && view === "view";
  const isCreating = !id && view === "create";
  const isReadOnly = isViewing || (!hasUpdateDeletePermission && !isCreating);

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

  // Clear all user.* fields if user_does_not_exist is true
  useEffect(() => {
    if (inputData.user_does_not_exist) {
      setInputData((prev) => {
        const cleared = { ...prev };

        // Clear "user" reference field
        if (cleared.user && typeof cleared.user === "string") {
          cleared.user = "";
        } else if (typeof cleared.user === "object") {
          cleared.user = {};
        }

        // Clear all user.* fields
        fields.forEach((field) => {
          if (
            typeof field.name === "string" &&
            field.name.startsWith("user.")
          ) {
            const parts = field.name.split(".");
            if (parts.length === 2) {
              if (cleared[parts[0]]) {
                cleared[parts[0]][parts[1]] = "";
              }
            }
          }
        });

        return cleared;
      });
    }
  }, [inputData.user_does_not_exist, fields]);

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
    <div className="p-4">
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
            .filter((field) => !field.section || field.section === "main")
            .filter((field) => {
              // ✅ Hide user.* fields if user_does_not_exist is true
              if (inputData.user_does_not_exist && field.name === "user") {
                return false;
              }
              return true;
            })
            .map((field, index) => {
              if (!shouldShowField(field, "create")) return null;
              if (["spacer", "half-spacer", "label"].includes(field.type)) {
                return renderSpacer(field, index);
              }

              return renderField({
                field,
                index,
                inputData,
                handleChange,
                setInputData,
                fields,
                dispatch,
                isReadOnly,
              });
            })}
        </div>

        {/* TOGGLE PATIENT RECORD SECTION */}

        {(tablename === "patients" || tablename === "doctors") && (
          <>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowSection(!showSection)}
                className="flex items-center text-blue-600 hover:underline text-sm"
              >
                {showSection ? (
                  <ChevronUp className="w-6 h-6 mr-1" />
                ) : (
                  <ChevronDown className="w-6 h-6 mr-1" />
                )}
              </button>
            </div>

            {showSection && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border-t pt-4">
                {fields
                  .filter((field) => field.section === "user")
                  .map((field, index) => {
                    if (!shouldShowField(field, "create")) return null;
                    if (
                      ["spacer", "half-spacer", "label"].includes(field.type)
                    ) {
                      return renderSpacer(field, index);
                    }
                    // ⛔ Skip password if user exists
                    if (
                      field.type === "password" &&
                      !inputData.user_does_not_exist
                    )
                      return null;

                    // ✅ Force read-only if field.name starts with 'user.' and user_does_not_exist is true
                    const isUserField =
                      typeof field.name === "string" &&
                      field.name.startsWith("user.");
                    const forceReadOnly =
                      isUserField && !inputData.user_does_not_exist;

                    return renderField({
                      field,
                      index,
                      inputData,
                      handleChange,
                      setInputData,
                      fields,
                      dispatch,
                      isReadOnly: forceReadOnly || isReadOnly,
                    });
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
    </div>
  );
};

export default FormNew;
