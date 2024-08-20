import { createSlice } from "@reduxjs/toolkit";
export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: false,
  },
  reducers: {
    toogleTheme: (state, action) => {
      state.theme = state.theme ? false : true;
    },
  },
});
export const { toogleTheme } = themeSlice.actions;
export default themeSlice.reducer;
