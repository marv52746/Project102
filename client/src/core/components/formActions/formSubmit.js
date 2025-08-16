import apiService from "../../services/apiService";
import { showNotification } from "../../services/slices/notificationSlice";
import { loggedUserData } from "../../services/slices/userSlice";

export const handleFormSubmit = async ({
  dispatch,
  tablename,
  id,
  data,
  fields,
  fileData,
  navigate,
  userInfo,
}) => {
  try {
    const hasFile = fileData || fields.some((f) => f.type === "file");

    // Clone original data to avoid mutating state
    const payload = JSON.parse(JSON.stringify(data));

    // Replace reference fields with just their IDs
    fields.forEach((field) => {
      if (field.type === "reference" && field.name !== "user") {
        const value = field.name
          .split(".")
          .reduce((obj, key) => obj?.[key], payload);
        const refId = value?._id || value?.id;

        if (refId) {
          // Flattened reference: user -> just id
          // Nested path: user._id -> user: "688..."
          const keys = field.name.split(".");
          if (keys.length === 1) {
            payload[field.name] = refId;
          } else {
            // Set deeply nested field: e.g., set user = id
            let temp = payload;
            for (let i = 0; i < keys.length - 1; i++) {
              temp = temp[keys[i]];
            }
            temp[keys[keys.length - 1]] = refId;
          }
        }
      }
    });

    // If form uses file
    if (hasFile) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : value
        );
      }

      if (fileData) {
        formData.append("avatar", fileData);
      }

      if (id) {
        await apiService.put(dispatch, tablename, id, formData, true);
      } else {
        await apiService.post(dispatch, tablename, formData, true);
      }
    } else {
      console.log(payload);
      if (id) {
        await apiService.put(dispatch, tablename, id, payload);
      } else {
        await apiService.post(dispatch, tablename, payload);
      }
    }

    dispatch(
      showNotification({
        message: id
          ? "Record updated successfully!"
          : "Record created successfully!",
        type: "success",
      })
    );

    // ✅ If updated user is current user, refresh userInfo
    if (tablename === "users" && id && userInfo && userInfo.id === id) {
      try {
        const updatedUser = await apiService.get(dispatch, `users/${id}`);
        const userWithId = { ...updatedUser, id: updatedUser._id };
        // console.log(userWithId);
        dispatch(loggedUserData(userWithId));
      } catch (err) {
        console.error("Failed to refresh current user info:", err);
      }
    }

    if (navigate) {
      navigate(`/list/${tablename}`);
    }
  } catch (error) {
    console.error("Form Submit Error:", error);
    dispatch(showNotification({ message: error.message, type: "error" }));
  }
};
