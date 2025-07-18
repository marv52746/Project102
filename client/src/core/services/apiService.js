// src/core/services/apiService.js
import axios from "axios";
import { showNotification } from "./slices/notificationSlice"; // Adjust path as needed

const baseURL = process.env.REACT_APP_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility: Converts JS object to FormData if needed
// const prepareData = (data) => {
//   const hasFile = Object.values(data).some((value) => value instanceof File);
//   if (!hasFile)
//     return { data, headers: { "Content-Type": "application/json" } };

//   const formData = new FormData();
//   Object.entries(data).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       formData.append(key, value);
//     }
//   });

//   return { data: formData, headers: { "Content-Type": "multipart/form-data" } };
// };

// Shared handler
const handleApiResponse = async (
  dispatch,
  apiCall,
  successMessage,
  errorMessage,
  showSuccess = true
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
      "Error updating resource"
    ),

  post: (dispatch, resource, data, isMultipart = false) =>
    handleApiResponse(
      dispatch,
      () =>
        apiClient.post(`/${resource}`, data, {
          headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
        }),
      "Created successfully",
      "Error creating resource"
    ),

  delete: (dispatch, resource, id) =>
    handleApiResponse(
      dispatch,
      () => apiClient.delete(`/${resource}/${id}`),
      "Deleted successfully",
      "Error deleting resource"
    ),
};

export default apiService;
