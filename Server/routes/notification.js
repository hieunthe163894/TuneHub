import {NotificationController} from "../controller/index.js"
import express from "express"
import verifyToken from "../middleware/verifyToken.js";
const notificationRouter = express.Router();
notificationRouter.get("/", verifyToken, NotificationController.getNotificationOfUser)
export default notificationRouter;