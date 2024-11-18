// src/core/services/apiService.js
import axios from "axios";
import { showNotification } from "./slices/notificationSlice"; // Adjust the import path as necessary

const baseURL = process.env.REACT_APP_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiResponse = async (
  dispatch,
  apiCall,
  successMessage,
  errorMessage,
  showSuccess = true // Add a parameter to control success notification
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
        message: `${errorMessage}: ${error.message}`,
        type: "error",
      })
    );
    throw error; // Rethrow the error to handle it in the calling function if needed
  }
};

const apiService = {
  get: (dispatch, resource) =>
    handleApiResponse(
      dispatch,
      () => apiClient.get(`/${resource}`),
      "", // No success message for fetch
      "Error fetching resource",
      false // Do not show success notification
    ),
  post: (dispatch, resource, data) =>
    handleApiResponse(
      dispatch,
      () => apiClient.post(`/${resource}`, data),
      "Created successfully",
      "Error creating resource"
    ),
  put: (dispatch, resource, id, data) =>
    handleApiResponse(
      dispatch,
      () => apiClient.put(`/${resource}/${id}`, data),
      "Updated successfully",
      "Error updating resource"
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
