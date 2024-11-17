import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
    authState: null,
  },

  reducers: {
    loggedUserData: (state, action) => {
      state.userInfo = action.payload;
      state.authState = true;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.authState = false;
    },
  },
});

export const { loggedUserData, logoutUser } = userSlice.actions;

export default userSlice.reducer;
