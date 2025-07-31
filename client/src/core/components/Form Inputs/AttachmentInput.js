import React from "react";
import { getAvatarUrl } from "../../utils/avatarURL";

const AttachmentInput = ({
  field,
  value,
  fileData,
  onChange,
  isReadOnly = false,
}) => {
  const previewUrl = fileData
    ? URL.createObjectURL(fileData)
    : value && typeof value === "string"
    ? getAvatarUrl(value)
    : null;

  return (
    <div className="space-y-2">
      <input
        id={field.name}
        name={field.name}
        type="file"
        accept={field.accept || "image/*"}
        onChange={onChange}
        disabled={field.disabled || isReadOnly}
        required={field.required}
        className="mt-1 block w-full text-sm text-gray-700 bg-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Attachment preview"
          className="w-24 h-24 object-cover rounded-md shadow-sm"
        />
      )}
    </div>
  );
};

export default AttachmentInput;
