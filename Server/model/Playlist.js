import mongoose, { Schema } from "mongoose";
import Song from "./Song.js";

const songDTO = new Schema({
  songId: { type: Schema.Types.ObjectId },
  song_name: {
    type: String,
    require: true,
  },
  is_exclusive: {
    type: Boolean,
  },
  start_time: {
    type: Number,
  },
  end_time: {
    type: Number,
  },
});

const playListSchema = new Schema(
  {
    play_list_name: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    songs: [songDTO],
    play_list_cover: {
      type: String,
    },
    stream_time: {
      type: Number,
    },
    is_admin_created: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true, collection: "Playlist" }
);
const Playlist = mongoose.model("Playlist", playListSchema);
export default Playlist;