import apiService from "../../services/apiService";
import { showNotification } from "../../services/slices/notificationSlice";
import { setNestedValue } from "../../utils/setNestedValue";

// /**
//  * Handles create or update form submission.
//  * @param {Object} options
//  * @param {Object} options.dispatch - Redux dispatch
//  * @param {String} options.tablename - API endpoint table name
//  * @param {String} [options.id] - Record ID (if editing)
//  * @param {Object} options.data - Input data
//  * @param {Array} options.fields - Field definitions
//  * @param {File} [options.fileData] - File (optional, usually avatar)
//  * @param {Function} options.navigate - useNavigate from react-router
//  */
// // export const handleFormSubmit = async ({
// //   dispatch,
// //   tablename,
// //   id,
// //   data,
// //   fields,
// //   fileData,
// //   navigate,
// // }) => {
// //   try {
// //     const formData = new FormData();
// //     // console.log(data);
// //     for (const field of fields) {
// //       const key = field.name;
// //       if (!key) continue;

// //       if (key === "avatar" && fileData) {
// //         formData.append("avatar", fileData);
// //         continue;
// //       }

// //       let value = data[key];

// //       if (field.type === "reference" && value && typeof value === "object") {
// //         value = value._id || value.id || "";
// //       }

// //       if (value !== undefined && value !== null) {
// //         formData.append(key, value);
// //       }
// //     }

// //     if (id) {
// //       await apiService.put(dispatch, tablename, id, formData, true);
// //       dispatch(
// //         showNotification({
// //           message: "Record updated successfully!",
// //           type: "success",
// //         })
// //       );
// //     } else {
// //       await apiService.post(dispatch, tablename, formData, true);
// //       dispatch(
// //         showNotification({
// //           message: "Record created successfully!",
// //           type: "success",
// //         })
// //       );
// //     }

// //     if (navigate) {
// //       navigate(`/list/${tablename}`);
// //     }
// //   } catch (error) {
// //     console.error("Form Submit Error:", error);
// //   }
// // };

// export const handleFormSubmit = async ({
//   dispatch,
//   tablename,
//   id,
//   data,
//   fields,
//   fileData,
//   navigate,
// }) => {
//   try {
//     let payload = {};
//     console.log(data);
//     for (const field of fields) {
//       const key = field.name;
//       if (!key) continue;

//       let value = data[key];

//       if (field.type === "reference" && value && typeof value === "object") {
//         value = value._id || value.id || "";
//       }

//       if (value !== undefined && value !== null) {
//         setNestedValue(payload, key, value); // handles user.first_name
//       }
//     }

//     // Handle file separately if using FormData
//     if (fileData || fields.some((f) => f.type === "file")) {
//       const formData = new FormData();
//       for (const [k, v] of Object.entries(payload)) {
//         if (typeof v === "object" && !(v instanceof File)) {
//           formData.append(k, JSON.stringify(v)); // nested object
//         } else {
//           formData.append(k, v);
//         }
//       }

//       if (fileData) {
//         formData.append("avatar", fileData);
//       }

//       if (id) {
//         await apiService.put(dispatch, tablename, id, formData, true);
//       } else {
//         await apiService.post(dispatch, tablename, formData, true);
//       }
//     } else {
//       if (id) {
//         console.log(payload);
//         await apiService.put(dispatch, tablename, id, payload);
//       } else {
//         await apiService.post(dispatch, tablename, payload);
//       }
//     }

//     dispatch(
//       showNotification({
//         message: id
//           ? "Record updated successfully!"
//           : "Record created successfully!",
//         type: "success",
//       })
//     );

//     if (navigate) {
//       navigate(`/list/${tablename}`);
//     }
//   } catch (error) {
//     console.error("Form Submit Error:", error);
//     dispatch(showNotification({ message: error.message, type: "error" }));
//   }
// };

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

    if (navigate) {
      navigate(`/list/${tablename}`);
    }
  } catch (error) {
    console.error("Form Submit Error:", error);
    dispatch(showNotification({ message: error.message, type: "error" }));
  }
};
