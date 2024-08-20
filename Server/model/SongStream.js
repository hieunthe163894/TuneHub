import mongoose, { Schema } from "mongoose";
import Song from "./Song.js";
import User from "./RegisteredUser.js";

// const userDTO = new Schema(
//   {
//     userId: { type: Schema.Types.ObjectId },
//   }
// );
// const songDTO = new Schema({
//   songId: { type: Schema.Types.ObjectId },
// });

const SongStreamSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      default: null
    },
    song: {
      type: Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true, collection: "SongStream" }
);

const SongStream = mongoose.model("SongStream", SongStreamSchema);
export default SongStream;
