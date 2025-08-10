// formHandlers.js
import apiService from "../../services/apiService";
import { showNotification } from "../../services/slices/notificationSlice";
import { setNestedValue } from "../../utils/setNestedValue";

// Delete handler
export const handleFormDelete = async ({
  dispatch,
  tablename,
  id,
  navigate,
}) => {
  try {
    await apiService.delete(dispatch, tablename, id);

    dispatch(
      showNotification({
        message: "Record deleted successfully!",
        type: "success",
      })
    );

    if (navigate) navigate(`/list/${tablename}`);
  } catch (error) {
    console.error("Delete Error:", error);
    dispatch(
      showNotification({
        message: "Failed to delete record.",
        type: "error",
      })
    );
  }
};

// Change handler
export const handleInputChange = ({ e, setInputData, setFileData }) => {
  const { name, value, type, files, checked } = e.target;
  let parsedValue = value;

  if (type === "file") {
    const file = files[0];
    setFileData?.(file);
    parsedValue = file;
  } else if (type === "checkbox") {
    parsedValue = checked;
  } else if (name.includes("_id")) {
    parsedValue = parseInt(value);
  }

  setInputData((prev) => {
    const updated = { ...prev };
    return setNestedValue(updated, name, parsedValue);
  });
};

export const handleEdit = ({ tablename, id, navigate }) => {
  if (tablename && id) {
    navigate(`/form/${tablename}/edit/${id}`);
  }
};

export const handleReferenceChange = ({
  name,
  value,
  fields,
  setInputData,
}) => {
  if (name === "user_section_data") {
    const userFields = fields.filter((f) => f.section === "user");

    if (value) {
      // Fill patient fields with selected reference value
      const newValues = {};
      userFields.forEach((field) => {
        if (value[field.name] !== undefined) {
          newValues[field.name] = value[field.name];
        }
      });
      setInputData((prev) => ({ ...prev, ...newValues }));
    } else {
      // Clear patient fields if reference is cleared
      const clearedValues = {};
      userFields.forEach((field) => {
        clearedValues[field.name] = "";
      });
      setInputData((prev) => ({ ...prev, ...clearedValues }));
    }

    return;
  }

  setInputData((prev) => ({ ...prev, [name]: value }));
};

export const handleCompleteAppointment = async ({
  dispatch,
  tablename,
  id,
  data,
}) => {
  try {
    await apiService.put(dispatch, tablename, id, data, true);

    dispatch(
      showNotification({
        message: "Record updated successfully!",
        type: "success",
      })
    );
  } catch (error) {
    dispatch(
      showNotification({
        message: "Failed to updated record.",
        type: "error",
      })
    );
  }
};
