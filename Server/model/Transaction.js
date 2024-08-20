import mongoose, { Schema } from "mongoose";
import User from "./RegisteredUser.js";
import Artist from "./Artist.js";
const TransactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
    },
    transactionType: {
      type: String,
      enum: ["album", "song", "artistKit", "donate"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    goodsId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true, collection: "Transaction" }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
