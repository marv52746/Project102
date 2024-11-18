import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    isVisible: false,
    message: "",
    type: "info", // Default type can be "success", "error", "warning", or "info"
  },
  reducers: {
    showNotification: (state, action) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification: (state) => {
      state.isVisible = false;
      state.message = "";
      state.type = "info";
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
