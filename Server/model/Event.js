import mongoose, { Schema } from "mongoose";
import Artist from "./Artist.js";
const EventSchema = new Schema(
  {
    artist: {
      type: mongoose.Types.ObjectId,
      ref: "Artist",
    },
    eventName: {
      type: String,
      default: "",
      required: true,
    },
    eventBanner: {
      type: String,
      default:
        "https://res.cloudinary.com/djzdhtdpj/image/upload/v1704269768/tempAvatar_juqb4s.jpg",
      required: true,
    },
    discount: {
      type: Number,
      default: 10,
      required: true,
    },
    eventContent: {
      type: String,
      default: "",
      required: true,
    },
    eventStart: {
      type: Date,
      required: true
    },
    eventDeadline: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Event",
  }
);
const Event = mongoose.model("Event", EventSchema);
export default Event;
