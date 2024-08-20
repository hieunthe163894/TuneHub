import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { IoMdInformationCircle } from "react-icons/io";

export const songQueueSlice = createSlice({
  name: "songQueue",
  initialState: {
    songQueue: [],
    queueIndex: 0,
    showBox: false,
  },

  reducers: {
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
    },
    setQueueIndex: (state, action) => {
      console.log(action.payload);
      state.queueIndex = action.payload;
    },
    toogleQueue: (state, action) => {
      state.showBox = state.showBox ? false : true;
    },
    setSongQueue: (state, action) => {
      state.songQueue = action.payload;
    },
    
  },
});
export const { addSongToQueue, setQueueIndex, setSongQueue } =
  songQueueSlice.actions;
export default songQueueSlice.reducer;
