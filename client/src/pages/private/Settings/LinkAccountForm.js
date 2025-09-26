// LinkAccountForm.js
import React from "react";

export default function LinkAccountForm({ data, setData, handleSubmit }) {
  const fields = [
    {
      name: "facebook",
      label: "Facebook",
      type: "url",
      placeholder: "https://facebook.com/username",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      type: "url",
      placeholder: "https://linkedin.com/in/username",
    },
    {
      name: "twitter",
      label: "Twitter/X",
      type: "url",
      placeholder: "https://twitter.com/username",
    },
    {
      name: "instagram",
      label: "Instagram",
      type: "url",
      placeholder: "https://instagram.com/username",
    },
    {
      name: "youtube",
      label: "Youtube",
      type: "url",
      placeholder: "https://youtube.com/username",
    },
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
          <div key={field.name} className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              value={data[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Linked Accounts
        </button>
      </div>
    </form>
  );
}
