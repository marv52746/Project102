import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, PlusCircle, Save, Trash } from "lucide-react";
import apiService from "../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../services/slices/notificationSlice";
import { getAvatarUrl } from "../utils/avatarURL";

const FormFormat = ({ data, fields }) => {
  const { tablename, id, view } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.userInfo);

  const allowedRoles = ["admin", "owner", "manager"];
  const hasUpdateDeletePermission =
    currentUser && allowedRoles.includes(currentUser.role);

  const isViewing = id && view === "view";
  const isCreating = !id && view === "create";
  const isEditing =
    id && view !== "view" && view !== "create" && hasUpdateDeletePermission;
  const canDelete = !!id && hasUpdateDeletePermission;

  const [inputData, setInputData] = useState(data || {});
  const [fileData, setFileData] = useState(null);
  const [refOptions, setRefOptions] = useState({}); // store fetched reference options

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
    setInputData(data || {});
  }, [data]);

  const handleEdit = () => {
    navigate(`/form/${tablename}/edit/${id}`);
  };

  // const handleSubmit = async () => {
  //   try {
  //     const formData = new FormData();

  //     // Add fields to FormData
  //     for (const key in inputData) {
  //       if (key !== "avatar") {
  //         formData.append(key, inputData[key]);
  //       }
  //     }

  //     if (fileData) {
  //       formData.append("avatar", fileData);
  //     }

  //     if (isEditing) {
  //       await apiService.put(dispatch, tablename, id, formData, true);
  //       dispatch(
  //         showNotification({
  //           message: "Record updated successfully!",
  //           type: "success",
  //         })
  //       );
  //     } else {
  //       await apiService.post(dispatch, tablename, formData, true);
  //       dispatch(
  //         showNotification({
  //           message: "Record created successfully!",
  //           type: "success",
  //         })
  //       );
  //     }

  //     navigate(`/list/${tablename}`);
  //   } catch (error) {
  //     console.error("Submit Error:", error);
  //   }
  // };

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

        // ✅ If field is a reference, extract only the ID
        if (field.type === "reference" && value && typeof value === "object") {
          value = value._id || value.id || ""; // fallback if the reference object isn't normalized
        }

        // ✅ Don't append null or undefined values
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }

      if (isEditing) {
        await apiService.put(dispatch, tablename, id, formData, true);
        dispatch(
          showNotification({
            message: "Record updated successfully!",
            type: "success",
          })
        );
      } else {
        await apiService.post(dispatch, tablename, formData, true);
        dispatch(
          showNotification({
            message: "Record created successfully!",
            type: "success",
          })
        );
      }

      navigate(`/list/${tablename}`);
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        await apiService.delete(dispatch, tablename, id);
        dispatch(
          showNotification({
            message: "Record deleted successfully!",
            type: "success",
          })
        );
        navigate(`/list/${tablename}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
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
    } else if (name.includes("_id")) {
      parsedValue = parseInt(value);
    }

    setInputData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const getInputValue = (field) => {
    const val = inputData[field.name];

    if (!val) return "";
    if (field.type === "date") {
      return new Date(val).toISOString().split("T")[0]; // "YYYY-MM-DD"
    }

    if (field.type === "datetime-local") {
      return new Date(val).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
    }

    if (field.type === "time") {
      return typeof val === "string"
        ? val
        : new Date(val).toTimeString().slice(0, 5); // "HH:MM"
    }

    return val;
  };

  const isReadOnly = isViewing || (!hasUpdateDeletePermission && !isCreating);

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full">
      <div className="mb-6">
        {/* <form encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.isArray(fields) &&
              fields
                .filter((field) => field)
                .map((field, index) => {
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

                  return (
                    <div key={index} className="col-span-1">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>

                      {field.type === "select" ? (
                        <select
                          id={field.name}
                          name={field.name}
                          value={inputData[field.name] || ""}
                          onChange={handleChange}
                          disabled={field.disabled || isReadOnly}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="" disabled>
                            Select {field.label}
                          </option>
                          {Array.isArray(field.options) &&
                            field.options.map((option, idx) => (
                              <option
                                key={idx}
                                value={option.value || option.id}
                              >
                                {option.label || option.name || option}
                              </option>
                            ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={inputData[field.name] || ""}
                          onChange={handleChange}
                          disabled={field.disabled || isReadOnly}
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
                                src={`${process.env.REACT_APP_BASE_URL_IMAGE}${
                                  inputData[field.name]
                                }`}
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
                          value={inputData[field.name] || ""}
                          onChange={handleChange}
                          disabled={field.disabled || isReadOnly}
                          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      )}
                    </div>
                  );
                })}
          </div>
        </form> */}
        <form encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, index) => {
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
                      value={inputData[field.name] || ""}
                      onChange={handleChange}
                      disabled={field.disabled || isReadOnly}
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
                      value={inputData[field.name] || ""}
                      onChange={handleChange}
                      disabled={field.disabled || isReadOnly}
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
                            // src={
                            //   inputData[field.name]
                            //     ? `${
                            //         process.env.REACT_APP_BASE_URL_IMAGE +
                            //         inputData[field.name]
                            //       }?t=${new Date().getTime()}`
                            //     : process.env.PUBLIC_URL +
                            //       "/assets/images/default-male.jpg"
                            // }
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
                      value={getInputValue(field)}
                      onChange={handleChange}
                      disabled={field.disabled || isReadOnly}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </form>
      </div>

      <div className="flex space-x-4 mt-6">
        {isViewing && hasUpdateDeletePermission && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Edit className="mr-2" />
            Edit
          </button>
        )}

        {isCreating && (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          >
            <PlusCircle className="mr-2" />
            Submit
          </button>
        )}

        {isEditing && (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg"
          >
            <Save className="mr-2" />
            Update
          </button>
        )}

        {canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            <Trash className="mr-2" />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default FormFormat;
