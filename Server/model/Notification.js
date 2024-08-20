import mongoose, { Schema } from "mongoose";
import User from "./RegisteredUser.js";

const NotificationSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    linkTo: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    user: { type: Schema.Types.ObjectId },
  },
  { timestamps: true, collection: "Notification" }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
