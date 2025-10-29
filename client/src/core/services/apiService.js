// src/core/services/apiService.js
import axios from "axios";
import { showNotification } from "./slices/notificationSlice"; // Adjust path as needed
import moment from "moment-timezone";

const baseURL = process.env.REACT_APP_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "x-api-key": process.env.REACT_APP_PUBLIC_API_KEY,
  },
  withCredentials: false, // ✅ set to true only if using cookies
});

// ✅ Helper: recursively convert ISO dates to PH timezone
function convertDatesToPH(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesToPH(item));
  } else if (obj && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string" && isISODate(value)) {
        newObj[key] = moment.utc(value).tz("Asia/Manila").format();
      } else {
        newObj[key] = convertDatesToPH(value);
      }
    }
    return newObj;
  }
  return obj;
}

function isISODate(str) {
  if (typeof str !== "string") return false;

  // Matches ISO dates: YYYY-MM-DD or YYYY/MM/DD
  // optionally with time and timezone (T08:00:00Z or +08:00)
  const isoDateRegex =
    /^\d{4}([-/])\d{2}\1\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$/;

  return isoDateRegex.test(str);
}

// ✅ Automatically convert GET response data to PH timezone
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.method === "get" && response.data) {
      // console.log("before", response.data);
      response.data = convertDatesToPH(response.data);
      // console.log("after", response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor to attach token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 👈 store token after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Shared handler
const handleApiResponse = async (
  dispatch,
  apiCall,
  successMessage,
  errorMessage,
  showSuccess = true,
  triggerRefresh = false // ✅ new flag
) => {
  try {
    const response = await apiCall();
    if (showSuccess) {
      dispatch(
        showNotification({
          message: successMessage,
          type: "success",
        })
      );
    }

    // Dispatch refresh key only if needed
    if (triggerRefresh) {
      dispatch({ type: "SET_REFRESH_KEY", payload: Date.now() });
    }

    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    dispatch(
      showNotification({
        message: `${errorMessage}: ${
          error?.response?.data?.error || error.message
        }`,
        type: "error",
      })
    );
    throw error;
  }
};

// API methods
const apiService = {
  get: (dispatch, resource, query) =>
    handleApiResponse(
      dispatch,
      () =>
        apiClient.get(`/${resource}`, {
          params: query, // 👈 this enables query string like ?role=doctor
        }),
      "",
      "Error fetching resource",
      false
    ),

  put: (dispatch, resource, id, data, isMultipart = false) =>
    handleApiResponse(
      dispatch,
      () =>
        apiClient.put(`/${resource}/${id}`, data, {
          headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
        }),
      "Updated successfully",
      "Error updating resource",
      true, // show success
      true // ✅ trigger refresh key
    ),

  post: (dispatch, resource, data, isMultipart = false) =>
    handleApiResponse(
      dispatch,
      () =>
        apiClient.post(`/${resource}`, data, {
          headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
        }),
      "Created successfully",
      "Error creating resource",
      true,
      true // ✅ trigger refresh key
    ),

  delete: (dispatch, resource, id) =>
    handleApiResponse(
      dispatch,
      () => apiClient.delete(`/${resource}/${id}`),
      "Deleted successfully",
      "Error deleting resource",
      true,
      true // ✅ trigger refresh key
    ),
};

export default apiService;
