import { createSlice } from "@reduxjs/toolkit";
import { internalRoles } from "../../constants/rolePresets";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
    authState: null,
    hasInternalRole: false,
  },

  reducers: {
    loggedUserData: (state, action) => {
      state.userInfo = action.payload;
      state.authState = true;
      state.hasInternalRole = internalRoles.includes(action.payload?.role);
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.authState = false;
    },
  },
});

export const { loggedUserData, logoutUser } = userSlice.actions;

export default userSlice.reducer;
