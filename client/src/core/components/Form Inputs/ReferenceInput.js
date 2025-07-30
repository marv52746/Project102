import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import apiService from "../../services/apiService";

const ReferenceInput = ({ field, value, onChange, dispatch }) => {
  const [refOptions, setRefOptions] = useState([]);

  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const records = await apiService.get(
          dispatch,
          field.ref,
          field.query || {}
        );
        // console.log(records);

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

    // Always notify parent with selected value (or null)
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
            onChange("patient_section_data", patientRecord); // trigger autofill
          }
        } catch (err) {
          console.error("Failed to load patient details:", err);
        }
      } else {
        // ❗Clear patient section data when reference is cleared
        onChange("patient_section_data", null);
      }
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={refOptions}
      isClearable
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
    />
  );
};

export default ReferenceInput;
