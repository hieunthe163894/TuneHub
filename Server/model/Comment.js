import mongoose, { Schema } from "mongoose";
import User from "./RegisteredUser.js";
import Song from "./Song.js";

const CommentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    songId: { type: Schema.Types.ObjectId },
    parent_comment: { type: Schema.Types.ObjectId },
    content: {
      type: String,
    },
    is_root: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, collection: "Comment" }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
