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
} from "./formActions/formHandlers";

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
    // console.log(data);
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

                // Spacer for new row
                if (field.type === "spacer") {
                  return (
                    <div
                      key={index}
                      className="col-span-2 h-0 sm:h-4"
                      aria-hidden="true"
                    />
                  );
                }

                // Half-column spacer (skips one column)
                if (field.type === "half-spacer") {
                  return <div key={index} className="col-span-1" />;
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
                const isRequired = !!field.required;

                return (
                  <div key={index} className="mb-0">
                    <label
                      htmlFor={field.label}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>

                    {field.type === "select" || field.type === "reference" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={
                          field.type === "reference"
                            ? inputData[field.name]?._id
                            : getInputValue(inputData, field)
                        }
                        onChange={handleChange}
                        disabled={field.disabled || isReadOnly}
                        required={isRequired}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Select {field.label}
                        </option>
                        {(field.type === "select"
                          ? field.options
                          : refOptions[field.name] || []
                        ).map((option, idx) => (
                          <option
                            key={idx}
                            value={option._id || option.id || option.value}
                          >
                            {option.name || option.label || option.email}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={getInputValue(inputData, field)}
                        onChange={handleChange}
                        disabled={field.disabled || isReadOnly}
                        required={isRequired}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        rows={4}
                      />
                    ) : field.type === "file" ? (
                      <div>
                        <input
                          id={field.name}
                          name={field.name}
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          disabled={field.disabled || isReadOnly}
                          required={isRequired}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {fileData && (
                          <img
                            src={URL.createObjectURL(fileData)}
                            alt="Preview"
                            className="mt-2 w-24 h-24 object-cover rounded-full"
                          />
                        )}
                        {!fileData &&
                          inputData[field.name] &&
                          typeof inputData[field.name] === "string" && (
                            <img
                              src={getAvatarUrl(inputData[field.name])}
                              alt="Avatar"
                              className="mt-2 w-24 h-24 object-cover rounded-full"
                            />
                          )}
                      </div>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={getInputValue(inputData, field)}
                        onChange={handleChange}
                        disabled={field.disabled || isReadOnly}
                        required={isRequired}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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
