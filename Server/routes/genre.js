import { GenreController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
const genreRouter = express.Router();
genreRouter.get("/", GenreController.getAllGenres);
export default genreRouter;