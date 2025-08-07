// utils/renderFieldInput.js
import React from "react";
import ReferenceInput from "./ReferenceInput";
import { handleReferenceChange } from "../formActions/formHandlers";
import SelectInput from "./SelectInput";
import TextareaInput from "./TextareaInput";
import PasswordInput from "./PasswordInput";
import AttachmentInput from "./AttachmentInput";
import MultiSelectInput from "./MultiSelectInput";
import { renderSpacer } from "./LabelSpacerInput";
import TextInput from "./TextInput";
import { getInputValue } from "../../utils/fieldUtils";
import CheckboxInput from "./CheckboxInput";
import NumberInput from "./NumberInput";
import DateTimeInput from "./DateTimeInput";

export const renderInputByType = ({
  field,
  value,
  handleChange,
  setInputData,
  fields,
  dispatch,
  isReadOnly,
}) => {
  switch (field.type) {
    case "reference":
      return (
        <ReferenceInput
          field={field}
          value={value}
          onChange={(name, value) =>
            handleReferenceChange({
              name,
              value,
              fields,
              setInputData,
            })
          }
          dispatch={dispatch}
        />
      );
    case "select":
      return (
        <SelectInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "textarea":
      return (
        <TextareaInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "password":
      return (
        <PasswordInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "file":
      return (
        <AttachmentInput
          field={field}
          value={value}
          fileData={value instanceof File ? value : null}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "multiselect":
      return (
        <MultiSelectInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "checkbox":
      return (
        <CheckboxInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "number":
      return (
        <NumberInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "date-time":
      return (
        <DateTimeInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
    case "spacer":
    case "half-spacer":
    case "label":
      return renderSpacer(field);
    default:
      return (
        <TextInput
          field={field}
          value={value}
          onChange={handleChange}
          isReadOnly={isReadOnly}
        />
      );
  }
};

export const renderField = ({
  field,
  index,
  inputData,
  handleChange,
  setInputData,
  fields,
  dispatch,
  isReadOnly = false, // ✅ add default
}) => {
  const value = getInputValue(inputData, field);

  return (
    <div key={index}>
      {!["spacer", "half-spacer", "label", "checkbox"].includes(field.type) && (
        <label
          htmlFor={field.name}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
        </label>
      )}
      {renderInputByType({
        field,
        value,
        handleChange,
        setInputData,
        fields,
        dispatch,
        isReadOnly,
      })}
    </div>
  );
};
