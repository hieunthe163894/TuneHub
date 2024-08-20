import mongoose, { Schema } from "mongoose";
import User from "./RegisteredUser.js";
import Album from "./Album.js";
import Song from "./Song.js";

const songDTO = new Schema({
  songId: { type: Schema.Types.ObjectId },
  song_name: {
    required: true,
    type: String,
  },
  song_cover: {
    type: String,
    required: true,
  },
  is_exclusive: {
    type: Schema.Types.Boolean,
    default: false
  },
});

const albumDTO = new Schema({
  albumId: { type: Schema.Types.ObjectId },
  album_name: { type: String, required: true },
  album_cover: { type: String, required: true },
  price: { type: Number, required: true },
});

const followerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true })

const ArtistSchema = new Schema(
  {
    artist_name: {
      type: String,
      required: true,
      unique: true,
    },
    song_uploads: {
      type: [songDTO],
      default: [],
    },
    albums: {
      type: [albumDTO],
      default: [],
    },
    followers: {
      type: [followerSchema],
      default: [],
    },
    account_number: {
      type: String,
      required: false,
    },
    account_holder: {
      type: String,
      required: false,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "Artist" }
);
const Artist = mongoose.model("Artist", ArtistSchema);
export default Artist;
