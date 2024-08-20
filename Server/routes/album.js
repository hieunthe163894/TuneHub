import { AlbumController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
const albumRouter = express.Router();
albumRouter.get("/getAllAlbums",AlbumController.getAllAlbums);
albumRouter.post("/add", verifyToken, AlbumController.addAlbum);
albumRouter.get(
  "/getAlbumsOfArtist/:artistId",
  AlbumController.getAlbumsOfArtists
);
albumRouter.get("/getHotAlbum", AlbumController.getAllHotAlbums)
albumRouter.get("/getAlbumById/:id",AlbumController.getAlbumById);
albumRouter.get("/filterAlbumByArtist/:date/:sort",verifyToken, AlbumController.getFilterAlbumByArtist);
albumRouter.post("/disableEnableAlbum",verifyToken, AlbumController.disableEnableAlbum);
albumRouter.put("/updateAlbumById",verifyToken, AlbumController.updateAlbumById);
albumRouter.get(
  "/getUserPurchasedAlbum",verifyToken,
  AlbumController.getUserPurchasedAlbum
);
export default albumRouter;
