import { createSlice } from "@reduxjs/toolkit";
export const searchSlide = createSlice({
  name: "search",
  initialState: {
    searchKey: ''
  },

  reducers: {
    addKeySearch: (state, action) => {
      state.searchKey = action.payload
    }
  },
});
export const {addKeySearch} = searchSlide.actions;
export default searchSlide.reducer;
