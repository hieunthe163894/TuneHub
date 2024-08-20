import { createSlice } from "@reduxjs/toolkit";
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userInfo: {},
  },

  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    logOut: (state, action) => {
      state.isLoggedIn = false;
      state.userInfo = {};
    },
    setUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },

  },
});
export const { login, logOut , setUserInfo} = authSlice.actions;
export default authSlice.reducer;
