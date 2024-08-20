import mongoose from "mongoose";

const content_reportedDTO = {
  question: { type: String, required: true },
};

const reportsSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    id_reported: { type: mongoose.Schema.Types.ObjectId, required: true },
    type_reported: {
      type: String,
      enum: ["song", "comment", "user"],
      required: true,
    },
    content_reported: {
      type: [content_reportedDTO],
      default: [],
    },
  },
  { timestamps: true, collection: "Report" }
);

const Report = mongoose.model("Report", reportsSchema);
export default Report;
