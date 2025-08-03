import React from "react";
import Select from "react-select";

const MultiSelectInput = ({ field, value = [], onChange, isReadOnly }) => {
  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions?.map((opt) => opt.value) || [];

    // Simulate event for unified form handler
    onChange({
      target: {
        name: field.name,
        value: selectedValues,
      },
    });
  };

  const selected = field.options.filter((opt) => value.includes(opt.value));

  return (
    <div className="mt-1">
      <Select
        isMulti
        isDisabled={field.disabled || isReadOnly}
        options={field.options}
        value={selected}
        onChange={handleChange}
        placeholder={`Select ${field.label}`}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db", // Tailwind gray-300
            minHeight: "42px",
            boxShadow: "none",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />
    </div>
  );
};

export default MultiSelectInput;
