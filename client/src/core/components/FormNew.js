import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";
import apiService from "../services/apiService";
import { useDispatch } from "react-redux";
import { showNotification } from "../services/slices/notificationSlice";
import { getInputValue, shouldShowField } from "../utils/fieldUtils";

const FormNew = ({ fields }) => {
  const { tablename } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({});
  const [refOptions, setRefOptions] = useState({}); // store fetched reference options
  const [fileData, setFileData] = useState(null);

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

        // 👉 If input is empty, fallback to default value
        const isEmpty = value === undefined || value === null || value === "";
        if (isEmpty && field.default !== undefined) {
          value =
            typeof field.default === "function"
              ? field.default() // allow dynamic default like () => new Date()
              : field.default;
        }

        // 👉 Convert default dates to proper formats if needed
        if (field.type === "date") {
          value = new Date(value).toISOString().split("T")[0]; // YYYY-MM-DD
        } else if (field.type === "datetime-local") {
          value = new Date(value).toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
        } else if (field.type === "time") {
          value =
            typeof value === "string"
              ? value
              : new Date(value).toTimeString().slice(0, 5); // HH:MM
        }

        // If reference type, extract ID
        if (field.type === "reference" && value && typeof value === "object") {
          value = value._id || value.id || "";
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
    } else if (name.includes("_id")) {
      parsedValue = parseInt(value);
    }

    setInputData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  return (
    <form
      encType="multipart/form-data"
      className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full"
      onSubmit={(e) => {
        e.preventDefault(); // Stop real page reload
        handleSubmit(); // Call your function
      }}
    >
      <div className="mb-6">
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, index) => {
              if (!shouldShowField(field, "create")) return null;
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
                      value={getInputValue(inputData, field)}
                      onChange={handleChange}
                      disabled={field.disabled}
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
                      disabled={field.disabled}
                      required={isRequired}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                      rows={4}
                    />
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={getInputValue(inputData, field)}
                      onChange={handleChange}
                      disabled={field.disabled}
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
