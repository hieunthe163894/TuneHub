import { createSlice } from "@reduxjs/toolkit";
export const sideBarSlice = createSlice({
  name: "sideBar",
  initialState: {
    expanded: window.innerWidth > 768,
  },
  reducers: {
    toogleExpand: (state, action) => {
      state.expanded = action.payload;
    },
  },
});
export const { toogleExpand } = sideBarSlice.actions;
export default sideBarSlice.reducer;
