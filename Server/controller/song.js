import {
  ArtistRepository,
  AuthenticateRepository,
  SongRepository,
  SongStreamRepository,
  NotificationRespository,
  UserRepository,
} from "../repository/index.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import jwt from "jsonwebtoken";
import formidable from "formidable";
import mongoose from "mongoose";
import { io } from "../index.js";

const getRecentlyPlayedSongs = async (req, res) => {
  try {
    const currentUserId = req.decodedToken.userId;
    const songStreams = await SongStreamRepository.getRecentlyPlayedSongStreams(
      currentUserId
    );

    const songs = await Promise.all(
      songStreams.map(async (stream) => {
        const song = await SongRepository.getSongsByIds(stream.song);
        return song[0];
      })
    );
    // const songs = await SongRepository.getSongsByIds(songStreams[0].song);
    res.status(200).json({ data: songs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const songList = await SongRepository.getAllSongs();
    return res.status(200).json({ data: songList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getSongsByAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await SongRepository.getSongsByAlbum(id);
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getSongByAlbumByArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const songs = await SongRepository.getSongByAlbumByArtist(id);
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const streamSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const quality = req.params.quality || "medium";
    const existingSong = await SongRepository.getSongsById({ songId });
    console.log(existingSong);
    if (!existingSong) {
      return res.status(400).json({ error: "Song not found!" });
    }
    console.log(existingSong);
    const fileName = existingSong.file_name;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = path.resolve(__dirname, "..", `upload`, "audio", fileName);
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
      userId = existingUser._id;
    }
    if (fs.existsSync(filePath)) {
      const { is_exclusive, preview_start_time, preview_end_time } =
        existingSong;
      let ffmpegCmd = ffmpeg(filePath)
        .audioCodec("libmp3lame")
        .format("mp3")
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
        });
      switch (quality) {
        case "low":
          ffmpegCmd.audioBitrate("10");
          break;
        case "medium":
          ffmpegCmd.audioBitrate("128");
          break;
        case "premium":
          console.log("hehe");
          ffmpegCmd.audioBitrate("320");
          break;
        default:
          ffmpegCmd.audioBitrate("128");
          break;
      }
      if (is_exclusive) {
        // console.log();
        if (
          userId &&
          existingSong.purchased_user.some(
            (item) => item.user && item.user.toString() === userId.toString()
          )
        ) {
          res.setHeader("Content-Type", "audio/mpeg");
          ffmpegCmd.pipe(res, { end: true });
        } else {
          ffmpegCmd
            .setStartTime(preview_start_time)
            .setDuration(preview_end_time - preview_start_time);
          res.setHeader("Content-Type", "audio/mpeg");
          ffmpegCmd.pipe(res, { end: true });
        }
      } else {
        res.setHeader("Content-Type", "audio/mpeg");
        ffmpegCmd.pipe(res, { end: true });
      }
    } else {
      return res.status(500).json({
        error: "File not found, please contact with the artist or the admin!",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addStreamSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
      userId = existingUser._id;
    }
    const songId = req.params.songId;
    const existingSong = await SongRepository.getSongsById({ songId });
    if (!existingSong) {
      return res.status(400).json({ error: "Song was not found" });
    }
    const songStream = SongStreamRepository.addSongStreamm({
      userId: userId,
      songId: existingSong._id,
    });
    return res.status(201).json({ result: "song stream added" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const uploadSong = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const { userId } = decodedToken;
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw new Error(err.message);
      }
      const songName = fields.songName ? fields.songName[0] : null;
      const genre = fields.genre ? fields.genre : null;
      const participatedArtists =
        fields.participatedArtists[0] !== ""
          ? fields.participatedArtists[0].split(",")
          : [];
      const duration = fields.duration ? parseInt(fields.duration[0]) : null;
      const isExclusive = fields.isExclusive
        ? fields.isExclusive[0] === "true"
        : false;
      const isPublic = fields.isPublic ? fields.isPublic[0] === "true" : false;
      const previewStart = fields.previewStart
        ? parseInt(fields.previewStart[0])
        : null;
      const previewEnd = fields.previewEnd
        ? parseInt(fields.previewEnd[0])
        : null;
      const price = fields.price ? parseInt(fields.price[0]) : null;
      // Access the uploaded files
      const coverImage = fields.coverImage ? fields.coverImage[0] : null;
      const artist = await ArtistRepository.findArtistByUserId(userId);
      if (!artist) {
        throw new Error("Unauthorized");
      }
      console.log(participatedArtists);
      const audioFile = files.audioFile;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      // Assuming audioFile is an array (you might need to adjust based on your structure)
      const uploadedFile = audioFile[0];
      const newFileName = Date.now() + uploadedFile.originalFilename;
      if (uploadedFile) {
        const newPath = path.join(
          __dirname,
          "..",
          `upload`,
          "audio",
          newFileName
        );
        fs.copyFileSync(uploadedFile.filepath, newPath);
        fs.unlinkSync(uploadedFile.filepath);
      }

      const result = await SongRepository.uploadSong({
        song_name: songName,
        genre: genre,
        participated_artist: participatedArtists,
        isExclusive: isExclusive,
        price: price,
        file_name: newFileName,
        preview_start_time: previewStart,
        preview_end_time: previewEnd,
        cover_image: coverImage,
        artist: artist._id,
        duration: duration,
        isPublic,
      });
      ArtistRepository.addSongUpload({
        artistId: artist._id,
        songId: result._id,
        songName: result.song_name,
        songCover: result.cover_image,
        isExclusive: result.is_exclusive,
      });
      const followers = artist.followers.map((f) => f.toString());
      const followersSet = new Set(followers);
      artist.followers.forEach(async (follower) => {
        await NotificationRespository.addNotification({
          userId: follower,
          content: `${artist.artist_name} just upload a new song`,
          linkTo: `songDetail/${result.song_name}`,
        });
      });
      io.sockets.sockets.forEach((socket) => {
        console.log("-----");
        console.log(socket.userId);
        if (followersSet.has(socket.userId)) {
          socket.emit("newNotification", {
            message: "You have a new notification",
          });
        }
      });
      return res.status(201).json({ message: "song uploaded successfully!!" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchSongByName = async (req, res) => {
  try {
    const songs = await SongRepository.searchSongByName(req.params.nameKey);
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllSongsByLastest1 = async (req, res) => {
  try {
    const { date, check } = req.params;
    const songs = await SongRepository.hotestSongByDay1(date, check);
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
      userId = new mongoose.Types.ObjectId(existingUser._id);
      songs.map((s, index) => {
        s.favouritedByUser = s.favourited.some((id) => id.equals(userId));
      });
    } else {
      songs.map((s, index) => {
        s.favouritedByUser = false;
      });
    }
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({
      message: error.toString(),
    });
  }
};
const getAllSongsByLastest = async (req, res) => {
  try {
    const { date, check } = req.params;
    const songs = await SongRepository.hotestSongByDay(date, check);
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
      userId = new mongoose.Types.ObjectId(existingUser._id);
      songs.map((s, index) => {
        s.favouritedByUser = s.favourited.some((id) => id.equals(userId));
      });
    } else {
      songs.map((s, index) => {
        s.favouritedByUser = false;
      });
    }
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({
      message: error.toString(),
    });
  }
};
const getSongsByLastest = async (req, res) => {
  try {
    const songs = await SongRepository.hotestSong();
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
      userId = new mongoose.Types.ObjectId(existingUser._id);
      songs.map((s, index) => {
        s.favouritedByUser = s.favourited.some((id) => id.equals(userId));
      });
    } else {
      songs.map((s, index) => {
        s.favouritedByUser = false;
      });
    }
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({
      message: error.toString(),
    });
  }
};

const getUnPublishedSongOfArtist = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const unpublishedSongs = await SongRepository.getUnPublishedSongOfArtist(
      artist._id
    );
    return res.status(200).json({ data: unpublishedSongs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getPopularSongOfArtist = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const result = await SongRepository.getPopularSongOfArtist(artistId);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getSongDetail = async (req, res) => {
  try {
    console.log("lon j day");
    const songId = req.params.songId;
    console.log(songId);
    const result = await SongRepository.getSongsByIdAgg(songId);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFeaturedSongs = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    if (!artistId) {
      return res.status(400).json({ error: "Bad request" });
    }
    const artist = await ArtistRepository.findByArtistId(artistId);
    if (!artist) {
      return res.status(404).json({ error: "Not found" });
    }
    const featuredSongs = await SongRepository.getFeaturedSongs(artistId);
    return res.status(200).json({ data: featuredSongs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const favouritedSong = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const songId = req.params.songId;
    const existingSong = await SongRepository.getSongsById({ songId });
    if (!existingSong) {
      return res.status(400).json({ error: "Song was not found" });
    }
    let opperation = "remove from favourite";
    if (existingSong.favourited.includes(userId)) {
      const favourited = await SongRepository.removeFavouriteSong({
        songId,
        userId: new mongoose.Types.ObjectId(userId),
      });
      favourited.favouritedByUser = false;
      console.log(favourited);
      return res.status(201).json({
        result: favourited,
        favourited: false,
        message: "Successfully " + opperation,
      });
    } else {
      opperation = "added to favourite";
      const favourited = await SongRepository.addFavouriteSong({
        songId,
        userId: new mongoose.Types.ObjectId(userId),
      });
      favourited.favouritedByUser = true;
      console.log(favourited);
      return res.status(201).json({
        result: favourited,
        favourited: true,
        message: "Successfully " + opperation,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkFavouriteSong = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
      userId = existingUser._id;
    }

    const songId = req.params.songId;
    const check = await SongRepository.checkFavouriteSong({
      userId,
      songId,
    });
    return res.status(200).json(check);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getFavouritedSong = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const songId = req.params.songId;
    const existingSong = await SongRepository.getSongsById(songId);
    if (!existingSong) {
      return res.status(400).json({ error: "Song was not found" });
    }
    const favourited = await SongRepository.favouriteSong({
      songId,
      userId: new mongoose.Types.ObjectId(userId),
    });
    return res.status(201).json({ result: "favourited song" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getLatestSongs = async (req, res) => {
  try {
    const limit = req.query.limit;
    const songType = req.query.songType;
    const songName = req.query.songName;
    const result = await SongRepository.getLatestSongs(
      limit,
      songType,
      songName
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getSongByGenre = async (req, res) => {
  try {
    const genreId = req.query.genreId;
    const limit = req.query.limit;
    const songType = req.query.songType;
    const songName = req.query.songName;
    const songs = await SongRepository.getSongByGenre({
      limit,
      songType,
      genreId,
      songName
    });
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getFilterSongByArtist = async (req, res) => {
  try {
    const date = req.params.date;
    const sort = req.params.sort;

    const userId = req.decodedToken.userId;
    const songs = await SongRepository.getFilterSongByArtist({
      userId: new mongoose.Types.ObjectId(userId),
      date,
      sort,
    });
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const disableEnableSong = async (req, res) => {
  try {
    // const artistId = req.decodedToken.userId;
    const { songId } = req.body;
    const songs = await SongRepository.disableEnableSong({
      songId,
    });
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getSongById = async (req, res) => {
  try {
    const { songId } = req.params;
    const songs = await SongRepository.getSongsById({
      songId,
    });
    return res.status(200).json({ data: songs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getRelevantSongs = async (req, res) => {
  try {
    const { artistIds, genres } = req.body;
    console.log(genres);
    const result = await SongRepository.getRelevantSong({ genres, artistIds });
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateSongById = async (req, res) => {
  try {
    const { songChange } = req.body;
    const song = await SongRepository.updateSongById({
      songChange,
    });
    res.status(200).json({ data: song });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getArtistSongIncome = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const date = req.params.date;
    const sort = req.params.sort;
    if (!artistId) {
      return res.status(400).json({ error: "artistId is required" });
    }

    const songs = await SongRepository.getFilterSongByArtist({
      userId: new mongoose.Types.ObjectId(artistId),
      date,
      sort,
    });
    return res.status(200).json({ data: songs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSong = async (req, res) => {
  try {
    const { _id, song_name, genre, participated_artist, price, event } =
      req.body;
    if (price.length === 0) {
      return res.status(400).json({ error: "invalid price input!" });
    }
    const result = await SongRepository.updatedSong({
      songId: _id,
      song_name,
      genre,
      featuredArtist: participated_artist,
      price: price,
      event,
    });
    return res.status(200).json({ message: "updated successfully !" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getUserPurchasedSongs = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;

    const existingUser = await UserRepository.findById(userId);
    const result = await SongRepository.getUserPurchasedSongs({
      purchasedSongs: existingUser.songs_purchased,
    });
    console.log(result);
    const purchasedSongs = result.map((song) => {
      song.favouritedByUser = song.favourited.includes(
        new mongoose.Types.ObjectId(userId)
      );
      return song;
    });
    return res.status(200).json({ data: purchasedSongs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllSongAdmin = async (req, res) => {
  try {
    const songList = await SongRepository.getAllSongAdmin();
    return res.status(200).json({ data: songList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const banSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const banSong = await SongRepository.banSong(id, active);
    res.status(200).json({ data: banSong });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default {
  getAllSongs,
  streamSong,
  addStreamSong,
  uploadSong,
  searchSongByName,
  getAllSongsByLastest,
  getAllSongsByLastest1,
  getUnPublishedSongOfArtist,
  getPopularSongOfArtist,
  getRecentlyPlayedSongs,
  getSongDetail,
  getFeaturedSongs,
  getSongsByLastest,
  getSongsByAlbum,
  favouritedSong,
  getFavouritedSong,
  getLatestSongs,
  getSongByGenre,
  checkFavouriteSong,
  getFilterSongByArtist,
  disableEnableSong,
  getSongByAlbumByArtist,
  getSongById,
  getRelevantSongs,
  updateSongById,
  getArtistSongIncome,
  updateSong,
  getUserPurchasedSongs,
  getAllSongAdmin,
  banSong,
};
