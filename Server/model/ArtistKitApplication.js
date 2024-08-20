import mongoose, { Schema } from "mongoose";
import User from "./RegisteredUser.js";
const ArtistKitApplicationSchema = new Schema({
  artistName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
});
const ArtistKitApplication = mongoose.model(
  "ArtistKitApplication",
  ArtistKitApplicationSchema
);
export default ArtistKitApplication;
