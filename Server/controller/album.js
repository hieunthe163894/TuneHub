import album from "../repository/album.js";
import {
  AlbumRepository,
  ArtistRepository,
  SongRepository,
} from "../repository/index.js";
import mongoose from "mongoose";

const addAlbum = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    console.log(req.body);
    const { album_cover, album_name, background, description, price, songs } =
      req.body;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const newAlbum = await AlbumRepository.createAlbum({
      artist: artist._id,
      album_name,
      songs: songs,
      description,
      album_cover,
      price,
      background,
    });
    const songIds = newAlbum.songs.map((song) => song._id);
    const songsUpdate = await SongRepository.makePublic({
      songIds,
      album: newAlbum._id,
    });
    const artistUpdate = await ArtistRepository.makeAlbum({
      albumId: newAlbum._id,
      album_name: newAlbum.album_name,
      album_cover: newAlbum.album_cover,
      price: newAlbum.price,
      artistId: artist._id,
    });
    return res.status(201).json({ message: "New album has been published !!" });
  } catch (error) {}
};
const getAlbumsOfArtists = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const albums = await AlbumRepository.getAlbumsOfArtists(artistId);
    return res.status(200).json({ data: albums });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllHotAlbums = async (req, res) => {
  try {
    const albums = await AlbumRepository.getHotestAlbums();
    return res.status(200).json({ data: albums });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    const album = await AlbumRepository.getAlbumById(id);
    res.status(200).json({ data: album[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getAllAlbums = async (req, res) => {
  try {
    const albums = await AlbumRepository.getAllAlbums();
    res.status(200).json({ data: albums });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilterAlbumByArtist = async (req, res) => {
  try {
    const date = req.params.date;
    const sort = req.params.sort;
    const userId = req.decodedToken.userId;
    const albums = await AlbumRepository.getFilterAlbumByArtist({
      userId: new mongoose.Types.ObjectId(userId),
      sort,
      date,
    });
    res.status(200).json({ data: albums });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const disableEnableAlbum = async (req, res) => {
  try {
    const {songId, status} = req.body;
    const albumId = songId;
    const albums = await AlbumRepository.disableEnableAlbum({
      albumId,
      status,
    });
    res.status(200).json({ data: albums });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateAlbumById = async (req, res) => {
  try {
    const {albumChange} = req.body;
    const album = await AlbumRepository.updateAlbumById({
      albumChange
    })
    res.status(200).json({ data: album });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getUserPurchasedAlbum = async (req,res) => {
  try {
    const userId = req.decodedToken.userId;
    const album = await AlbumRepository.getUserPurchasedAlbum({
      userId: new mongoose.Types.ObjectId(userId),
    })
    res.status(200).json({data: album})
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export default {
  addAlbum,
  getAlbumsOfArtists,
  getAlbumById,
  getAllAlbums,
  getAllHotAlbums,
  getFilterAlbumByArtist,
  disableEnableAlbum,
  updateAlbumById,
  getUserPurchasedAlbum
};
