import mongoose, { Schema } from "mongoose";
import Artist from "./Artist.js";
import Album from "./Album.js";
import User from "./RegisteredUser.js";
import Event from "./Event.js";
const songSchema = new Schema(
  {
    song_name: {
      type: String,
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
    participated_artist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        default: [],
      },
    ],
    price: {
      type: Number,
    },
    is_exclusive: {
      type: Boolean,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: "album",
    },
    file_name: {
      type: String,
      required: true,
    },
    preview_start_time: {
      type: Number,
    },
    preview_end_time: {
      type: Number,
    },
    cover_image: {
      type: String,
      default: "https://www.studytienganh.vn/upload/2021/05/101591.png"
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
    duration: {
      type: Number,
      required: true,
    },
    is_public: {
      type: Schema.Types.Boolean,
      default: true,
    },
    favourited: [{ type: Schema.Types.ObjectId }],
    purchased_user: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    active: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "Song" }
);
songSchema.path("purchased_user");
const Song = mongoose.model("Song", songSchema);
export default Song;
