import express from "express";
import { PlaylistController } from "../controller/index.js";
import verifyToken from "../middleware/verifyToken.js";

const playlistRouter = express.Router();

playlistRouter.post("/create", verifyToken, PlaylistController.createPlaylist);

playlistRouter.post("/push", PlaylistController.addSongToPlaylist);

// Route to get a playlist by ID
playlistRouter.get("/getPlaylistById/:playlistId", PlaylistController.getPlaylistById);

// Route to delete a playlist
playlistRouter.delete("/deletePlaylist/:playlistId",verifyToken, PlaylistController.deletePlaylist);

// Route to get all playlists by user ID
playlistRouter.get("/getAllPlaylistsByUserId/:creator", PlaylistController.getAllPlaylistsByUserId);

// Route to get all moods by user ID
playlistRouter.get("/getAllMoodsByUserId", PlaylistController.getAllMoodsByUserId);

//gett all bai hat playlist
playlistRouter.get("/getAllSongsByPlaylistId/:playlistId", PlaylistController.getAllSongsByPlaylistId);

// delêt song in playlist
playlistRouter.delete("/deleteSongInPlaylist/:playlistId/:songId", PlaylistController.deleteSongInPlaylist);



export default playlistRouter;
