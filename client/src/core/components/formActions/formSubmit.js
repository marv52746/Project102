import apiService from "../../services/apiService";
import { setRefreshKey } from "../../services/reducers/utilsReducer";
import { showNotification } from "../../services/slices/notificationSlice";
import { loggedUserData } from "../../services/slices/userSlice";
import moment from "moment-timezone";

// ✅ Helper: recursively convert all Date/time fields to UTC
function convertDatesToUTC(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesToUTC(item));
  } else if (obj && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        newObj[key] = moment(value).utc().toDate();
      } else if (typeof value === "string" && isISODate(value)) {
        // Only convert YYYY-MM-DD strings
        newObj[key] = moment.tz(value, "Asia/Manila").utc().toDate();
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  }
  return obj;
}

function isISODate(str) {
  if (typeof str !== "string") return false;

  // Matches YYYY-MM-DD or YYYY/MM/DD, optionally with time
  const isoDateRegex = /^\d{4}([-/])\d{2}\1\d{2}(\s+\d{2}:\d{2}(:\d{2})?)?$/;

  return isoDateRegex.test(str);
}

export const handleFormSubmit = async ({
  dispatch,
  tablename: rawTablename,
  id,
  data,
  fields,
  fileData,
  navigate,
  userInfo,
  notificationMessage,
}) => {
  try {
    console.log(data);

    // ✅ Fix: normalize tablename (patients/doctors should map to users)
    const tablename =
      rawTablename === "patients" || rawTablename === "doctors"
        ? "users"
        : rawTablename;

    // Clone original data to avoid mutating state
    const payload = JSON.parse(JSON.stringify(data));

    // ✅ If creating patient/doctor → set role
    if (!id && (rawTablename === "patients" || rawTablename === "doctors")) {
      payload.role = rawTablename === "patients" ? "patient" : "doctor";
    }

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

    let savedRecord;
    let bodyToSend = convertDatesToUTC(payload);

    // // If form uses file
    if (fileData) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(bodyToSend)) {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            value.forEach((v) => formData.append(`${key}[]`, v));
          }
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value);
        } else if (typeof value === "object" && value !== null) {
          // ✅ Only stringify normal objects
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }

      if (fileData) {
        formData.append("avatar", fileData);
      }

      if (id) {
        savedRecord = await apiService.put(
          dispatch,
          tablename,
          id,
          formData,
          true
        );
      } else {
        // console.log(formData);
        savedRecord = await apiService.post(
          dispatch,
          tablename,
          formData,
          true
        );
      }
    } else {
      if (id) {
        savedRecord = await apiService.put(dispatch, tablename, id, bodyToSend);
      } else {
        savedRecord = await apiService.post(dispatch, tablename, bodyToSend);
      }
    }

    dispatch(
      showNotification({
        message: notificationMessage
          ? notificationMessage
          : id
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
    dispatch(setRefreshKey(Date.now())); // use timestamp so it's always new

    if (navigate) {
      navigate(`/list/${tablename}`);
    }

    // ✅ Return the saved record
    return savedRecord;
  } catch (error) {
    console.error("Form Submit Error:", error);
    dispatch(showNotification({ message: error.message, type: "error" }));
  }
};
