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

    if (field.name === "user") {
      if (selectedValue) {
        try {
          const userId =
            selectedValue._id || selectedValue.id || selectedValue.value;
          const userRecord = await apiService.get(dispatch, `users/${userId}`);
          if (userRecord) {
            onChange("user_section_data", userRecord);
          }
        } catch (err) {
          console.error("Failed to load user details:", err);
        }
      } else {
        onChange("user_section_data", null);
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
              label: value.name || value.label,
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
