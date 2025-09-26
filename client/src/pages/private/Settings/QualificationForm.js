// QualificationForm.js
import React from "react";
import CreatableSelect from "react-select/creatable";
import {
  doctorCertificationOptionsPH,
  doctorSpecializationOptionsArr,
  qualificationOptions,
} from "../../../core/constants/choices";

export default function QualificationForm({ data, setData, handleSubmit }) {
  const fields = [
    {
      name: "specialization",
      label: "Specialization",
      type: "multiselect",
      options: doctorSpecializationOptionsArr,
    },
    {
      name: "license",
      label: "License Number",
      type: "text",
      placeholder: "Enter license number",
    },
    {
      name: "qualification",
      label: "Qualification",
      type: "multiselect",
      options: qualificationOptions,
    },
    {
      name: "years_experience",
      label: "Years of Experience",
      type: "number",
      placeholder: "e.g. 5",
    },
    {
      name: "certifications",
      label: "Certifications",
      type: "multiselect",
      options: [],
    },
    {
      name: "awards",
      label: "Awards",
      type: "multiselect",
      options: [],
    },

    // {
    //   name: "affiliations",
    //   label: "Affiliations",
    //   type: "multiselect",
    //   options: [
    //     "Philippine Medical Association",
    //     "WHO",
    //     "Red Cross",
    //     "Hospital Partner",
    //   ],
    // },
  ];

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
      _status: data._id ? "updated" : "new",
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "col-span-2" : "col-span-1"}
          >
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={data[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full border rounded px-3 py-2"
              />
            ) : field.type === "multiselect" ? (
              <CreatableSelect
                isMulti
                value={(data[field.name] || []).map((v) => ({
                  value: v,
                  label: v,
                }))}
                onChange={(selected) =>
                  handleChange(
                    field.name,
                    selected.map((s) => s.value)
                  )
                }
                options={field.options.map((opt) => ({
                  value: opt,
                  label: opt,
                }))}
                className="w-full"
                placeholder={`Select or type ${field.label}`}
              />
            ) : (
              <input
                type={field.type}
                value={data[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full border rounded px-3 py-2"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Qualifications
        </button>
      </div>
    </form>
  );
}
