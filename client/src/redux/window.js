import { createSlice } from "@reduxjs/toolkit";
export const windowSlice = createSlice({
  name: "window",
  initialState: {
    scrollPos: 0,
  },
  reducers: {
    setScrollPos: (state, action) =>{
        state.scrollPos = action.payload
    }
  },
});
export const { setScrollPos } = windowSlice.actions;
export default windowSlice.reducer;
