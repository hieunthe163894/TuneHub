import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { IoMdInformationCircle } from "react-icons/io";
export const playerSlice = createSlice({
  name: "auth",
  initialState: {
    isPlaying: false,
    currentSong: {},
    volume: 50,
    progress: 0,
    songQueue: [],
    queueIndex: 0,
    showBox: false,
    loop: false,
    sliderValue: 0,
    quality: "medium"
  },

  reducers: {
    toogleIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setQuality: (state, action) =>{
      state.quality = action.payload
    },
    toogleLoop: (state, action) => {
      state.loop = !state.loop
    },
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
    },
    changeVolume: (state, action) => {
      state.volume = action.payload;
      // console.log(state.volume);
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    setSongQueue: (state, action) => {
      state.songQueue = action.payload;
      if (!state.currentSong._id) {
        state.currentSong = state.songQueue[state.queueIndex];
        state.isPlaying = true;
      }else{
        state.currentSong = state.songQueue[state.queueIndex];
        state.isPlaying = true;
      }
    },
    addSongToQueue: (state, action) => {
      const existingSong = state.songQueue.find(
        (song) => song._id == action.payload._id
      );
      if (existingSong) {
        toast("Song Already In Queue", {
          icon: (
            <IoMdInformationCircle className="text-light10 dark:text-dark10" />
          ),
        });
      } else {
        state.songQueue.push(action.payload);
        toast.success("Song Added To Queue");
      }
      if (!state.currentSong._id) {
        state.currentSong = state.songQueue[state.queueIndex];
        state.isPlaying = true;
      }
    },
    removeSongFromQueue: (state, action) => {
      state.songQueue.splice(action.payload, 1);
      if (state.queueIndex > action.payload) {
        state.queueIndex--;
      } else {
        if (state.queueIndex === action.payload) {
          if (state.songQueue.length > 0) {
            state.currentSong = state.songQueue[action.payload];
          } else {
            state.currentSong = {};
          }
        }
      }
    },
    setQueueIndex: (state, action) => {
      console.log(action.payload);
      state.queueIndex = action.payload;
    },
    finishSong: (state, action) => {
      if (state.queueIndex + 2 <= state.songQueue.length) {
        state.isPlaying = true;
        state.queueIndex++;
        state.currentSong = state.songQueue[state.queueIndex];
      } else {
        state.isPlaying = false;
        state.currentSong = {}
      }
    },
    toogleQueue: (state, action) => {
      state.showBox = state.showBox ? false : true;
    },
    setSliderValue: (state, action) => {
      state.progress = action.payload
      state.sliderValue = action.payload;
    },
  },
});
//hehe
export const {
  toogleIsPlaying,
  setCurrentSong,
  changeVolume,
  updateProgress,
  finishSong,
  addSongToQueue,
  removeSongFromQueue,
  setQueueIndex,
  toogleQueue,
  toogleLoop,
  setSliderValue,
  setSongQueue,
  setQuality
} = playerSlice.actions;
export default playerSlice.reducer;
