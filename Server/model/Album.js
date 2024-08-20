import mongoose, { Schema } from "mongoose";
import Song from "./Song.js";
import User from "./RegisteredUser.js";

const songDTO = new Schema({
  _id: { type: Schema.Types.ObjectId },
  song_name: {
    required: true,
    type: String,
  },
  cover_image: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
});

const albumSchema = new Schema(
  {
    artist: { type: Schema.Types.ObjectId, ref: "Artist" },
    album_name: {
      type: String,
    },
    songs: [songDTO],
    description: {
      type: String,
    },
    purchasers: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    album_cover: {
      type: String,
    },
    price: {
      type: Number,
    },
    is_public: {
      type: Schema.Types.Boolean,
      default: true,
    },
    background: {
      type: String,
      default: "#E57F94",
    },
  },
  { timestamps: true, collection: "Album" }
);
const Album = mongoose.model("album", albumSchema);
export default Album;
