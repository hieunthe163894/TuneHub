import { createSlice } from "@reduxjs/toolkit";
export const artistUploadSlice = createSlice({
  name: "artistUpload",
  initialState: {
    genres: [],
    songInfo: {
      participatedArtists: []
    },
  },
  reducers: {
    setGenres: (state, action) => {
      state.genres = action.payload;
    },
    setSongInfo: (state, action) => {
      const updateSongInfo = { ...state.songInfo, [action.payload.name]: action.payload.value };
      state.songInfo = updateSongInfo
      console.log(updateSongInfo);
    },
  },
});
export const { setGenres, setSongInfo } = artistUploadSlice.actions;
export default artistUploadSlice.reducer;
