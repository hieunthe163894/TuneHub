import { EventController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
const eventRouter = express.Router();
eventRouter.post("/", verifyToken, EventController.addEvent);
eventRouter.get("/", verifyToken, EventController.getArtistActiveEvent);
export default eventRouter;
