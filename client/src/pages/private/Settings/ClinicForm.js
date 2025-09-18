// ClinicForm.js
import React from "react";
import { useSelector } from "react-redux";
import { userClinicSettings } from "../../../core/constants/settings";

export default function ClinicForm({ data, setData, handleSubmitClinic }) {
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleChange = (index, field, value) => {
    const updatedClinics = [...data];
    updatedClinics[index] = {
      ...updatedClinics[index],
      [field]: value,
      _status: updatedClinics[index]._id ? "updated" : "new",
    };
    setData(updatedClinics);
  };

  const addClinic = () => {
    setData([
      ...data,
      {
        name: "",
        address: "",
        phone_number: "",
        email: "",
        website: "",
        short_description: "",
        doctors: userInfo?.id ? [userInfo.id] : [],
        _status: "new",
      },
    ]);
  };

  const removeClinic = (index) => {
    const updatedClinics = [...data];
    if (updatedClinics[index]._id) {
      updatedClinics[index]._status = "deleted";
    } else {
      updatedClinics.splice(index, 1);
    }
    setData(updatedClinics);
  };

  return (
    <div className="space-y-8">
      {data
        .filter((clinic) => clinic._status !== "deleted")
        .map((clinic, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Clinic {index + 1}</h4>
              {data.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeClinic(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userClinicSettings.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === "textarea" ? "col-span-2" : "col-span-1"
                  }
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={clinic[field.name] || ""}
                      onChange={(e) =>
                        handleChange(index, field.name, e.target.value)
                      }
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full border rounded px-3 py-2"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={clinic[field.name] || ""}
                      onChange={(e) =>
                        handleChange(index, field.name, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full border rounded px-3 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Buttons Row */}
      <div className="flex justify-end space-x-3 pt-4">
        {data.filter((clinic) => clinic._status !== "deleted").length < 2 && (
          <button
            type="button"
            onClick={addClinic}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            + Add More Clinic
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmitClinic}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Clinic
        </button>
      </div>
    </div>
  );
}
