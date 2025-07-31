import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import apiService from "../../services/apiService";

const ReferenceInput = ({
  field,
  value,
  onChange,
  dispatch,
  isReadOnly = false,
}) => {
  const [refOptions, setRefOptions] = useState([]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const records = await apiService.get(
          dispatch,
          field.ref,
          field.query || {}
        );

        const formatted = records.map((option) => ({
          label: option.name || option.label || option.email,
          value: option._id || option.id,
          full: option,
        }));

        setRefOptions(formatted);
      } catch (err) {
        console.error(`Error fetching ${field.ref}`, err);
      }
    };

    fetchReferenceData();
  }, [field, dispatch]);

  const loadOptions = async () => refOptions;

  const handleChange = async (selected) => {
    const selectedValue = selected?.full || null;
    onChange(field.name, selectedValue);

    if (field.name === "patient") {
      if (selectedValue) {
        try {
          const userId =
            selectedValue._id || selectedValue.id || selectedValue.value;
          const patientRecord = await apiService.get(
            dispatch,
            `users/${userId}`
          );
          if (patientRecord) {
            onChange("patient_section_data", patientRecord);
          }
        } catch (err) {
          console.error("Failed to load patient details:", err);
        }
      } else {
        onChange("patient_section_data", null);
      }
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={refOptions}
      isClearable={!isReadOnly}
      placeholder={`Search ${field.label}`}
      value={
        value
          ? {
              label: value.name || value.label || value.email,
              value: value._id || value.id,
            }
          : null
      }
      onChange={handleChange}
      isDisabled={field.disabled || isReadOnly} // ✅ add this line
    />
  );
};

export default ReferenceInput;
