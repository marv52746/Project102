import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";
import apiService from "../services/apiService";
import { useDispatch } from "react-redux";
import { showNotification } from "../services/slices/notificationSlice";
import { shouldShowField } from "../utils/fieldUtils";

const FormNew = ({ fields }) => {
  const { tablename } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputData, setInputData] = useState({});
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

  const handleSubmit = async () => {
    try {
      await apiService.post(dispatch, tablename, inputData);
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
    const { name, value } = e.target;
    const parsedValue = name.includes("_id") ? value : value; // adjust if needed

    setInputData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full">
      <div className="mb-6">
        <form>
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
                      value={inputData[field.name] || ""}
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
                      value={inputData[field.name] || ""}
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
                      value={inputData[field.name] || ""}
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
        </form>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
        >
          <Edit className="mr-2" />
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormNew;
