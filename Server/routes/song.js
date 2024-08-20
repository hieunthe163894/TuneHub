import { SongController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from '../middleware/authorization.js';
const songRouter = express.Router();
songRouter.get("/getAll", SongController.getAllSongs);
songRouter.get("/getSongByAlbum/:id", SongController.getSongsByAlbum);
songRouter.get("/getSongByAlbumByArtist/:id", SongController.getSongByAlbumByArtist);
songRouter.get("/recentSong", verifyToken, SongController.getRecentlyPlayedSongs)
songRouter.get("/streamSong/:songId/:quality", SongController.streamSong);
songRouter.post("/uploadSingle", verifyToken, SongController.uploadSong);
songRouter.get("/search/:nameKey", SongController.searchSongByName);
songRouter.post("/addSongStream/:songId", SongController.addStreamSong);
songRouter.get("/detailSong/:songId", SongController.getSongDetail);
songRouter.get(
  "/leaderboard/topSong1/:date/:check",
  SongController.getAllSongsByLastest1
);
songRouter.get(
  "/leaderboard/topSong/:date/:check",
  SongController.getAllSongsByLastest
);
songRouter.get(
  "/unpublished",
  verifyToken,
  SongController.getUnPublishedSongOfArtist
);
songRouter.get("/getArtistPopularSongs/:artistId", SongController.getPopularSongOfArtist)
songRouter.get("/getFeaturedSongs/:artistId", SongController.getFeaturedSongs)
songRouter.get("/getHotestSong", SongController.getSongsByLastest)
songRouter.post("/favourited/:songId", verifyToken, SongController.favouritedSong);
songRouter.get("/getHotestSong", SongController.getSongsByLastest)
songRouter.get("/getLatest", SongController.getLatestSongs)
songRouter.get("/getSongByGenre", SongController.getSongByGenre)
songRouter.get("/checkFavorite/:songId", SongController.checkFavouriteSong)
songRouter.get("/filterSongByArtist/:date/:sort", verifyToken, SongController.getFilterSongByArtist);
songRouter.get("/getArtistSongIncome/:date/:sort/:artistId", verifyToken, SongController.getArtistSongIncome);
songRouter.post("/disableEnableSong", verifyToken, SongController.disableEnableSong);
songRouter.get("/getSongById/:songId", SongController.getSongById);
songRouter.post("/getRelevantSongs", SongController.getRelevantSongs);
songRouter.put("/updateSongById", verifyToken, SongController.updateSongById);
songRouter.patch("/updateSong", SongController.updateSong);
songRouter.get("/getPurchasedSongs", verifyToken, SongController.getUserPurchasedSongs);
songRouter.get("/getAllSongAdmin", verifyToken, checkRole("admin"), SongController.getAllSongAdmin);
songRouter.put('/banSong/:id', verifyToken, checkRole("admin"), SongController.banSong);
export default songRouter;
