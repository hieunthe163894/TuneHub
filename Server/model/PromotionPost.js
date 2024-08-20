import mongoose, { Schema } from "mongoose";
import Artist from './Artist.js'

const PromotionPostSchema = new Schema(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
    poster: {
      type: String,
      required: true,
    },
    view_count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: "PromotionPost" }
);
const PromotionPost = mongoose.model("PromotionPost", PromotionPostSchema);
export default PromotionPost;
