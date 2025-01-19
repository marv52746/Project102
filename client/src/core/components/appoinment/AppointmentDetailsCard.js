import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Trash } from "lucide-react"; // Importing icons from lucide-react

const AppointmentDetailsCard = ({ data, fields }) => {
  const { tablename, id, view } = useParams();
  const navigate = useNavigate();

  const [appointmentData, setAppointmentData] = useState(data);

  // console.log(data);

  useEffect(() => {
    setAppointmentData(data);
  }, [data]);

  const handleEdit = () => {
    navigate(`/form/${tablename}/edit/${id}`);
  };

  const handleSubmit = () => {
    // submit the form
    console.log(appointmentData);
  };

  const handleDelete = () => {
    // delete the record
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col p-6 rounded-lg shadow-lg bg-white w-full">
      <div className="mb-6">
        <form>
          {/* Fields loop with two-column layout for small inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div key={index} className="mb-4">
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
                    value={appointmentData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="" disabled>
                      Select {field.label}
                    </option>
                    {field.options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.name || option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={appointmentData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                ) : field.type === "datetime-local" ? (
                  <div className="relative">
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={appointmentData[field.name]}
                      onChange={handleChange}
                      disabled={field.disabled}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={appointmentData[field.name]}
                      onChange={handleChange}
                      disabled={field.disabled}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* Action buttons with icon improvements */}
      <div className="flex space-x-4 mt-6">
        {view === "view" ? (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          >
            <Edit className="mr-2" />
            Edit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
          >
            <Edit className="mr-2" />
            Update
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <Trash className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetailsCard;
