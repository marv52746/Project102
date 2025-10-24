import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { clinicalFormFieldMap } from "../../constants/medical/clinicalPresets";
import { getInputValue } from "../../utils/fieldUtils";
import apiService from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshKey } from "../../services/reducers/utilsReducer";
import { canEditForms } from "../../constants/rolePresets";
import CreatableSelect from "react-select/creatable";

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
  // console.log(fields);
  // console.log(formData);
  // console.log(type);

  const gridClass = type === "appointment" ? "col-span-2" : "col-span-1";
  return (
    <div className="grid grid-cols-2 gap-4">
      {fields
        .filter((f) => !f.hidden)
        .map((field) => {
          const value = formData[field.name] || "";

          // ✅ Proper conditional logic
          if (field.conditional) {
            const { field: dependsOn, value: expectedValue } =
              field.conditional;
            if (formData[dependsOn] !== expectedValue) {
              return null;
            }
          }

          return (
            // <div key={field.name} className={`col-span-2 sm:col-span-1`}>
            <div key={field.name} className={`col-span-2 sm:${gridClass}`}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={4}
                  className="w-full border rounded-lg p-2 text-sm"
                  value={value}
                  disabled={readOnly}
                  required={field.required}
                  placeholder={field.placeholder}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              ) : field.type === "reactselect" ? (
                <CreatableSelect
                  isMulti={false}
                  value={
                    formData[field.name]
                      ? {
                          label: formData[field.name],
                          value: formData[field.name],
                        }
                      : null
                  }
                  onChange={(selected) => {
                    const value = selected?.value || ""; // sanitize to string
                    setFormData({ ...formData, [field.name]: value });
                  }}
                  options={field.options || []}
                  placeholder={field.placeholder}
                  styles={{
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999, // 🔹 Ensures dropdown stays above modals or tables
                    }),
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999, // 🔹 Ensures portal dropdown appears on top
                    }),
                  }}
                  menuPortalTarget={document.body} // 🔹 Important for proper z-index layering
                />
              ) : field.type === "multiselect" ? (
                <CreatableSelect
                  isMulti
                  value={getInputValue(formData, field)}
                  onChange={(selected) =>
                    setFormData({ ...formData, [field.name]: selected })
                  }
                  options={field.options || []}
                  placeholder={field.placeholder}
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
  tableName,
  status,
}) => {
  const dispatch = useDispatch();
  const [entries, setEntries] = useState(
    Array.isArray(initialData) && initialData.length > 0 ? initialData : [{}]
  );
  const [toDelete, setToDelete] = useState([]); // 🆕 track deleted IDs
  const userInfo = useSelector((state) => state.user.userInfo);
  const [expandedIndexes, setExpandedIndexes] = useState([0]); // store which entries are open

  // Reset entries when modal opens
  useEffect(() => {
    setEntries(
      Array.isArray(initialData) && initialData.length > 0 ? initialData : [{}]
    );

    // ✅ Collapse all if more than one record, expand only first if single
    if (initialData.length > 1) {
      setExpandedIndexes([]); // collapse all
    } else {
      setExpandedIndexes([0]); // expand first
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialData), isOpen]);

  // toggle one entry
  const toggleEntry = (idx) => {
    setExpandedIndexes(
      (prev) =>
        prev.includes(idx)
          ? prev.filter((i) => i !== idx) // collapse if already open
          : [...prev, idx] // expand if closed
    );
  };

  const handleAddMore = () => {
    const newIndex = entries.length;
    setEntries([...entries, {}]);
    // Collapse all old entries, open only the new one
    setExpandedIndexes([newIndex]);
  };

  const handleChange = (index, updatedData) => {
    const newEntries = [...entries];
    newEntries[index] = updatedData;
    setEntries(newEntries);
  };

  const handleRemove = (index, id) => {
    if (entries.length === 1) return; // at least one must remain

    if (id) setToDelete((prev) => [...prev, id]); // mark for deletion

    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      // Delete marked items
      for (const id of toDelete) {
        await apiService.delete(dispatch, tableName, id);
      }
      setToDelete([]);

      // Save updated entries
      onSave(entries);

      // Reset & close
      setEntries([{}]); // reset
      dispatch(setRefreshKey(Date.now())); // use timestamp so it's always new
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  // console.log(type);
  // console.log(entries);

  const canAddMoreTypes = [
    "medications",
    "surgeries",
    "allergies",
    "labrequest",
  ];
  const canAddMore = canAddMoreTypes.includes(tableName);

  const readOnly =
    status !== "scheduled" &&
    status !== "ready" &&
    !canEditForms.includes(userInfo.role);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSave}>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
          {entries
            .filter((e) => e)
            .map((formData, idx) => {
              const isExpanded = expandedIndexes.includes(idx);
              const displayName =
                formData?.name || formData?.label || `Entry ${idx + 1}`;

              return (
                <div
                  key={idx}
                  className="p-4 border rounded-xl bg-gray-50 relative transition-all"
                >
                  {/* Header bar */}
                  <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => toggleEntry(idx)}
                  >
                    <span className="font-medium text-gray-800">
                      {canAddMore && displayName}
                    </span>

                    <div>
                      {!readOnly && entries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemove(idx, formData._id)}
                          className="p-1 rounded-full hover:bg-red-100 mr-3"
                          title="Remove entry"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEntry(idx);
                        }}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        {isExpanded ? "−" : "+"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="mt-3">
                      <ClinicalForm
                        fields={fields}
                        formData={formData}
                        setFormData={(updated) => handleChange(idx, updated)}
                        columns={columns}
                        type={type}
                        readOnly={readOnly}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="flex justify-between items-center mt-6">
            {columns === 2 && canAddMore && (
              <button
                type="button"
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
                type="submit"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:brightness-90"
              >
                {canAddMore ? "Save All" : "Save"}
              </button>
            </div>
          </div>
        )}
      </form>
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
      tableName="medications"
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
      title="Add Diagnosis"
      fields={clinicalFormFieldMap.others}
      onSave={onSave}
      type="appointment"
      initialData={initialData}
      tableName="appointments"
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
      tableName="conditions"
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
      tableName="vitals"
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
      tableName="surgeries"
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
      tableName="allergies"
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
      tableName="pregnancies"
    />
  );
};

// ✅ Laboratory Request Modal
export const LabRequestModal = ({
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
      title="Add Laboratory Request Tests"
      fields={clinicalFormFieldMap.labrequest}
      onSave={onSave}
      columns={2}
      initialData={initialData}
      tableName="labrequest"
    />
  );
};

// ✅ Ultrasound Modal
export const UltrasoundModal = ({
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
      title="Add Ultrasound Results"
      fields={clinicalFormFieldMap.ultrasounds}
      onSave={onSave}
      columns={2}
      initialData={initialData}
      tableName="ultrasound"
    />
  );
};
