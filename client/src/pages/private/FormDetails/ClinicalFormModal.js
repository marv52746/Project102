import React, { useState } from "react";
import { X, XCircle } from "lucide-react";
import { handleFormSubmit } from "../../../core/components/formActions/formSubmit";
import { useDispatch } from "react-redux";
import { clinicalFormFieldMap } from "../../../core/constants/medical/clinicalPresets";
import {
  handleFormDelete,
  handleInputChange,
} from "../../../core/components/formActions/formHandlers";
import { capitalizeText } from "../../../core/utils/stringUtils";
import { getInputValue } from "../../../core/utils/fieldUtils";
import ConfirmModal from "../../../core/components/modal/ConfirmModal";

export default function ClinicalFormModal({
  onClose,
  patient,
  mode, // create | edit | view
  initialData,
  type,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [formData, setFormData] = useState({
    type: type || "vitals",
    patient: patient || initialData?.patient || "",
    ...initialData,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    handleInputChange({ e, setInputData: setFormData });
  };

  const handleDeleteConfirm = () => {
    handleFormDelete({
      dispatch,
      tablename: formData.type,
      id: initialData._id,
      // navigate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      patient: patient,
    };

    const fields = (clinicalFormFieldMap[formData.type] || []).filter(
      (field) => field.name
    );

    handleFormSubmit({
      dispatch,
      tablename: formData.type,
      data: payload,
      id: initialData._id || null,
      fields,
    });
    onClose();
  };

  const currentFields = clinicalFormFieldMap[formData.type] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {mode === "view" ? "View" : "Add"}{" "}
            {capitalizeText(type?.replace("_", " "))} Record
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type !== "appointments" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Record Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={mode === "view"}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="vitals">Vital</option>
                <option value="conditions">Condition</option>
                <option value="medications">Medication</option>
                <option value="allergies">Allergy</option>
                <option value="surgeries">Surgical History</option>
                <option value="pregnancies">Pregnancy</option>
                <option value="others">Others</option>
              </select>
            </div>
          )}

          {currentFields.map((field, idx) => {
            if (!field.name) return null;
            const value = formData[field.name] || "";

            // 👇 If hidden, render a hidden input field
            if (field.hidden) {
              return (
                <input
                  key={idx}
                  type="hidden"
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                />
              );
            }

            if (field.type === "textarea") {
              return (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <textarea
                    name={field.name}
                    value={getInputValue(formData, field)}
                    onChange={handleChange}
                    rows={field.rows || 3}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={mode === "view"}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  ></textarea>
                </div>
              );
            }

            return (
              <InputField
                key={idx}
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={getInputValue(formData, field)}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
                disabled={mode === "view"}
                options={field.options || []} // Pass select options if any
              />
            );
          })}

          {mode !== "view" && (
            <div className="flex justify-end sticky bottom-0 pt-4 gap-2">
              {mode === "edit" && (
                <button
                  type="button"
                  // onClick={handleDeleteConfirm} // Define your onDelete handler
                  onClick={() => {
                    setModalConfig({
                      title: "Confirm Delete",
                      description: "Are you sure you want to delete this data?",
                      confirmText: "Delete",
                      confirmColor: "bg-red-600",
                      icon: <XCircle className="w-5 h-5 text-red-600" />,
                      onConfirm: handleDeleteConfirm,
                    }) || setIsModalOpen(true);
                    // onClose();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                {mode === "edit" ? "Update" : "Submit"}
              </button>
            </div>
          )}
        </form>
      </div>
      {/* Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...modalConfig}
      />
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type,
  required,
  disabled,
  options = [], // for select fields
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Checkbox */}
      {type === "checkbox" ? (
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          onChange={(e) =>
            onChange({
              target: { name, value: e.target.checked },
            })
          }
          required={required}
          disabled={disabled}
          className="mt-1"
        />
      ) : type === "select" ? (
        /* Select dropdown */
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
        >
          <option value="">Select...</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        /* Default text/number/date/etc. */
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      )}
    </div>
  );
}

// function InputField({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type,
//   required,
//   disabled,
// }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <input
//         type={type}
//         name={name}
//         value={value || ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         disabled={disabled}
//         className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
//       />
//     </div>
//   );
// }
