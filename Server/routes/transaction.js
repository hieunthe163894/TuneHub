import expresss from "express";
import verifyToken from "../middleware/verifyToken.js";
import { TransactionController } from "../controller/index.js";
const transactionRouter = expresss.Router();
transactionRouter.get(
  "/getTransactionHistory",
  verifyToken,
  TransactionController.getTransactionHistory
);
export default transactionRouter;