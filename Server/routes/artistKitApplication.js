import express from "express";
import { ArtistKitApplicationController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";

const artistKitApplicationRouter = express.Router();
artistKitApplicationRouter.post("/", verifyToken, ArtistKitApplicationController.createArtistKitApplication);
artistKitApplicationRouter.get("/getAllApplication", verifyToken, ArtistKitApplicationController.getAllApplication);
artistKitApplicationRouter.put("/interactApplication/:id", ArtistKitApplicationController.interactApplication)
export default artistKitApplicationRouter