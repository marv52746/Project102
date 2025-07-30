import apiService from "../../services/apiService";
import { showNotification } from "../../services/slices/notificationSlice";

/**
 * Handles create or update form submission.
 * @param {Object} options
 * @param {Object} options.dispatch - Redux dispatch
 * @param {String} options.tablename - API endpoint table name
 * @param {String} [options.id] - Record ID (if editing)
 * @param {Object} options.data - Input data
 * @param {Array} options.fields - Field definitions
 * @param {File} [options.fileData] - File (optional, usually avatar)
 * @param {Function} options.navigate - useNavigate from react-router
 */
export const handleFormSubmit = async ({
  dispatch,
  tablename,
  id,
  data,
  fields,
  fileData,
  navigate,
}) => {
  try {
    const formData = new FormData();
    // console.log(data);
    for (const field of fields) {
      const key = field.name;
      if (!key) continue;

      if (key === "avatar" && fileData) {
        formData.append("avatar", fileData);
        continue;
      }

      let value = data[key];

      if (field.type === "reference" && value && typeof value === "object") {
        value = value._id || value.id || "";
      }

      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }

    if (id) {
      await apiService.put(dispatch, tablename, id, formData, true);
      dispatch(
        showNotification({
          message: "Record updated successfully!",
          type: "success",
        })
      );
    } else {
      await apiService.post(dispatch, tablename, formData, true);
      dispatch(
        showNotification({
          message: "Record created successfully!",
          type: "success",
        })
      );
    }

    if (navigate) {
      navigate(`/list/${tablename}`);
    }
  } catch (error) {
    console.error("Form Submit Error:", error);
  }
};
