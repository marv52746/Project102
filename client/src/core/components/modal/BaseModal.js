import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { clinicalFormFieldMap } from "../../constants/medical/clinicalPresets";
import { getInputValue } from "../../utils/fieldUtils";

const BaseModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-11/12 max-w-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ✅ Dynamic form renderer
const ClinicalForm = ({ fields, formData, setFormData, type, readOnly }) => {
  // console.log(type);
  const gridClass = type === "appointment" ? "col-span-2" : "col-span-1";
  return (
    <div className="grid grid-cols-2 gap-4">
      {fields
        .filter((f) => !f.hidden)
        .map((field) => {
          const value = formData[field.name] || "";

          return (
            // <div key={field.name} className={`col-span-2 sm:col-span-1`}>
            <div key={field.name} className={`col-span-2 sm:${gridClass}`}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  className="w-full border rounded-lg p-2 text-sm"
                  value={value}
                  disabled={readOnly}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              ) : (
                <InputField
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={getInputValue(formData, field)}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={readOnly}
                  options={field.options || []} // Pass select options if any
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

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
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
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

// ✅ Multi-entry modal with add/remove row
const MultiEntryModal = ({
  isOpen,
  onClose,
  title,
  fields,
  onSave,
  columns,
  type,
  initialData = [],
  status,
}) => {
  const [entries, setEntries] = useState(
    Array.isArray(initialData) && initialData.length > 0 ? initialData : [{}]
  );

  // Reset entries when modal opens
  useEffect(() => {
    setEntries(
      Array.isArray(initialData) && initialData.length > 0 ? initialData : [{}]
    );
  }, [initialData, isOpen]);
  // console.log(entries);

  const handleAddMore = () => setEntries([...entries, {}]);

  const handleChange = (index, updatedData) => {
    const newEntries = [...entries];
    newEntries[index] = updatedData;
    setEntries(newEntries);
  };

  const handleRemove = (index) => {
    if (entries.length === 1) return; // at least one must remain
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(entries);
    setEntries([{}]); // reset
    onClose();
  };

  const readOnly = status !== "scheduled" && status !== "ready";
  // console.log(status);
  // console.log(readOnly);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
        {entries.map((formData, idx) => {
          return (
            <div
              key={idx}
              className="p-4 border rounded-xl bg-gray-50 relative"
            >
              <span className="absolute -top-2 left-3 bg-white px-2 text-xs text-gray-500">
                Entry {idx + 1}
              </span>

              {/* Remove row button */}
              {entries.length > 1 && !readOnly && (
                <button
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100"
                  title="Remove entry"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}

              <ClinicalForm
                fields={fields}
                formData={formData}
                setFormData={(data) => handleChange(idx, data)}
                columns={columns}
                type={type}
                readOnly={readOnly}
              />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {!readOnly && (
        <div className="flex justify-between items-center mt-6">
          {columns === 2 && (
            <button
              onClick={handleAddMore}
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" /> Add More
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEntries([{}]); // ✅ reset all inputs
                onClose(); // ✅ close modal
              }}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:brightness-90"
            >
              Save All
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

// ✅ Prescription Modal
export const PrescriptionModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  // console.log(initialData);
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Prescription"
      fields={clinicalFormFieldMap.medications}
      onSave={onSave}
      columns={2}
      initialData={initialData}
    />
  );
};

// ✅ Findings Modal
export const FindingsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Findings"
      fields={clinicalFormFieldMap.others}
      onSave={onSave}
      type="appointment"
      initialData={initialData}
    />
  );
};

// ✅ Findings Modal
export const ConditionsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Findings"
      fields={clinicalFormFieldMap.conditions}
      onSave={onSave}
      columns={2}
      initialData={initialData}
    />
  );
};

// ✅ Vitals Modal
export const VitalsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Vitals"
      fields={clinicalFormFieldMap.vitals}
      onSave={onSave}
      columns={2}
      initialData={initialData}
    />
  );
};

// ✅ Surgeries Modal
export const SurgeriesModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Surgeries"
      fields={clinicalFormFieldMap.surgeries}
      onSave={onSave}
      columns={2}
      initialData={initialData}
    />
  );
};

// ✅ Allergies Modal
export const AllergiesModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Allergies"
      fields={clinicalFormFieldMap.allergies}
      onSave={onSave}
      columns={2}
      initialData={initialData}
    />
  );
};

// ✅ Pregnancies Modal
export const PregnanciesModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  status,
}) => {
  return (
    <MultiEntryModal
      status={status}
      isOpen={isOpen}
      onClose={onClose}
      title="Add Pregnancies"
      fields={clinicalFormFieldMap.pregnancies}
      onSave={onSave}
      columns={2}
      initialData={initialData}
    />
  );
};
