import { ArtistController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import artist from "../repository/artist.js";
import checkRole from "../middleware/authorization.js";

const artistRouter = express.Router();
artistRouter.post("/findByName", verifyToken, ArtistController.findByName);
artistRouter.get("/getArtistInfo/:artistId", ArtistController.getArtistInfo)
artistRouter.get("/search/:nameKey", ArtistController.searchArtistByName);
artistRouter.get("/explore/rising", ArtistController.getRisingArtist);

artistRouter.get("/leaderboard/topArtist", ArtistController.getAllHotArtist)
artistRouter.get("/getStatistic/:span", verifyToken, ArtistController.getStatistic)
artistRouter.get("/getTrend/", verifyToken, ArtistController.getSongStreamOrRevenueTrend)
artistRouter.get("/getTopGenre", verifyToken, ArtistController.getTopGenre)
artistRouter.get("/getStreamFavouritePurchase", verifyToken, ArtistController.getStreamFavouritePurchase)
artistRouter.get("/getTopDonateUser", verifyToken, ArtistController.getTopDonateUser)
artistRouter.get("/getCountFollower", verifyToken, ArtistController.getCountFollower)
artistRouter.get("/revenueRatio/:span", verifyToken, ArtistController.getRevenueRatio)
artistRouter.get("/mostStreamed/:span", verifyToken, ArtistController.getArtist5MostStreamSongs);
artistRouter.get("/trackPerformance/:span", verifyToken, ArtistController.getTrackPerformance)
artistRouter.get("/mostArtistStreamedByAdmin/:span/:artistId",verifyToken, checkRole("admin"), ArtistController.getArtist5MostStreamSongsByAdmin);
artistRouter.get("/getArtistStatisticByAdmin/:artistId/:span", verifyToken,checkRole("admin"), ArtistController.getArtistStatisticByAdmin)
artistRouter.get("/getArtistRetioIncomeByAdmin/:artistId/:span", verifyToken,checkRole("admin"), ArtistController.getArtistRetioIncomeByAdmin)
artistRouter.post("/createArtistByAdmin", verifyToken, checkRole("admin"), ArtistController.createArtistByAdmin)
artistRouter.get("/getAllArtistLable", verifyToken, checkRole("admin"), ArtistController.getAllArtistLable)
export default artistRouter;