import { CommentController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
const commentRouter = express.Router();
commentRouter.get("/getAllComments/:songId", CommentController.getAllComents);
commentRouter.post("/add", verifyToken, CommentController.addComments);
export default commentRouter;