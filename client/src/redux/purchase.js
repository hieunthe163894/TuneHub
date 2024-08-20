import { createSlice } from "@reduxjs/toolkit";
export const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    song: null,
    bank: ""
  },

  reducers: {
    setPurchaseSong: (state, action) => {
      state.song = { ...state.song, ...action.payload };
    },
    setBank : (state, action) =>{
      state.bank = action.payload
    }
  },
});
export const {setPurchaseSong, setBank} = purchaseSlice.actions;
export default purchaseSlice.reducer;
