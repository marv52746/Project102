import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, PlusCircle, Save, Trash } from "lucide-react";
import apiService from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { getAvatarUrl } from "../utils/avatarURL";
import { adminOnlyRoles } from "../constants/rolePresets";
import { getInputValue, shouldShowField } from "../utils/fieldUtils";

import ConfirmDeleteModal from "./modal/ConfirmDeleteModal";
import { handleFormSubmit } from "./formActions/formSubmit";
import {
  handleEdit,
  handleFormDelete,
  handleInputChange,
  handleReferenceChange,
} from "./formActions/formHandlers";
import TextInput from "./Form Inputs/TextInput";
import TextareaInput from "./Form Inputs/TextareaInput";
import SelectInput from "./Form Inputs/SelectInput";
import ReferenceInput from "./Form Inputs/ReferenceInput";
import AttachmentInput from "./Form Inputs/AttachmentInput";
import { renderSpacer } from "./Form Inputs/LabelSpacerInput";

const FormFormat = ({ data, fields }) => {
  const { tablename, id, view } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.userInfo);

  const hasUpdateDeletePermission =
    currentUser && adminOnlyRoles.includes(currentUser.role);

  const isViewing = id && view === "view";
  const isCreating = !id && view === "create";
  const isEditing =
    id && view !== "view" && view !== "create" && hasUpdateDeletePermission;
  const canDelete = !!id && hasUpdateDeletePermission;

  const [inputData, setInputData] = useState(data || {});
  const [fileData, setFileData] = useState(null);
  const [refOptions, setRefOptions] = useState({}); // store fetched reference options
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchReferenceData = async () => {
      const refsToFetch = fields.filter((f) => f.type === "reference");

      for (const refField of refsToFetch) {
        try {
          const records = await apiService.get(
            dispatch,
            refField.ref,
            refField.query || {} // 👈 Pass query as parameter
          );

          setRefOptions((prev) => ({
            ...prev,
            [refField.name]: records,
          }));
        } catch (err) {
          console.error(`Error fetching ${refField.ref}`, err);
        }
      }
    };

    fetchReferenceData();
  }, [fields, dispatch]);

  useEffect(() => {
    console.log(data);
    setInputData(data || {});
  }, [data]);

  const handleSubmit = async () => {
    handleFormSubmit({
      dispatch,
      tablename,
      id,
      data: inputData,
      fields,
      fileData,
      navigate,
    });
  };

  const handleChange = (e) => {
    handleInputChange({ e, setInputData, setFileData });
  };

  const handleDeleteConfirm = () => {
    handleFormDelete({ dispatch, tablename, id, navigate });
    setShowDeleteModal(false);
  };

  const isReadOnly = isViewing || (!hasUpdateDeletePermission && !isCreating);

  return (
    <div className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Stop real page reload
          handleSubmit(); // Call your function
        }}
        encType="multipart/form-data"
        className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full"
      >
        <div className="mb-6">
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field, index) => {
                if (!shouldShowField(field, view)) return null;
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

                const value = getInputValue(inputData, field);

                return (
                  <div key={index} className="mb-0">
                    <label
                      htmlFor={field.label}
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
                        isReadOnly={isReadOnly}
                      />
                    ) : field.type === "select" ? (
                      <SelectInput
                        field={field}
                        value={value}
                        isReadOnly={isReadOnly}
                        onChange={handleChange}
                      />
                    ) : field.type === "textarea" ? (
                      <TextareaInput
                        field={field}
                        value={value}
                        onChange={handleChange}
                        isReadOnly={isReadOnly}
                      />
                    ) : field.type === "file" ? (
                      <AttachmentInput
                        field={field}
                        value={inputData[field.name]}
                        fileData={fileData}
                        onChange={handleChange}
                        isReadOnly={isReadOnly}
                      />
                    ) : (
                      <TextInput
                        field={field}
                        value={value}
                        isReadOnly={isReadOnly}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        </div>

        <div className="flex space-x-4 mt-6">
          {isViewing && hasUpdateDeletePermission && (
            <button
              type="button"
              onClick={() => handleEdit({ tablename, id, navigate })}
              className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Edit className="mr-2" />
              Edit
            </button>
          )}

          {isCreating && (
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
            >
              <PlusCircle className="mr-2" />
              Submit
            </button>
          )}

          {isEditing && (
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg"
            >
              <Save className="mr-2" />
              Update
            </button>
          )}

          {canDelete && (
            <button
              type="button"
              // onClick={() =>
              //   handleFormDelete({
              //     dispatch,
              //     tablename,
              //     id,
              //     navigate,
              //   })
              // }
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              <Trash className="mr-2" />
              Delete
            </button>
          )}
        </div>
      </form>
      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default FormFormat;
