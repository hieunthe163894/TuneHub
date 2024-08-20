import mongoose, { Schema } from "mongoose";

const reportQuestionSchema = new Schema(
    {
        question: {
            type: String
        }
    },
    { timestamps: true, collection: "ReportQuestion" }
);

const ReportQuestion = mongoose.model("ReportQuestion", reportQuestionSchema);
export default ReportQuestion;
