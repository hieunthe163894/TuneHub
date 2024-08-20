import {
  ArtistRepository,
  TransactionRepository,
  SongStreamRepository,
} from "../repository/index.js";
import moment from "moment";
import mongoose from "mongoose";
const findByName = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const searchInput = req.body.artistName;
    const result = await ArtistRepository.findArtistByName({
      searchInput: searchInput,
      artistId: artist._id,
    });
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRisingArtist = async (req, res) => {
  try {
    const artists = await ArtistRepository.getRisingArtist();
    return res.status(200).json({ data: artists });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchArtistByName = async (req, res) => {
  try {
    const artists = await ArtistRepository.searchArtistByName(
      req.params.nameKey
    );
    return res.status(200).json({ data: artists });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllHotArtist = async (req, res) => {
  try {
    const artists = await ArtistRepository.hotArtist();
    res.status(200).json({ data: artists });
  } catch (error) {
    getAllSongsByLastest.res.status(500).json({
      message: error.toString(),
    });
  }
};
const getArtistInfo = async (req, res) => {
  try {
    const artisId = req.params.artistId;
    if (!artisId) {
      return res.status(400).json({ error: "Bad request" });
    }
    const artist = await ArtistRepository.findByArtistId(artisId);
    if (!artist) {
      return res.status(404).json({ error: "Not found" });
    }
    const { followers, ...filteredArtist } = artist;

    filteredArtist.followersCount = artist.followers.length;
    return res.status(200).json({ data: filteredArtist });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const getStatistic = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const span = req.params.span;
    const sale = await TransactionRepository.getSaleOfArtist(artist._id, span);
    console.log(sale);
    const songStream = await SongStreamRepository.getArtistSongStream(
      artist._id,
      span
    );

    return res.status(200).json({
      data: {
        sale: sale,
        followers: 5,
        streamTime: songStream[0].total,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
const getSongStreamOrRevenueTrend = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const span = req.query.span || "weekly";
    const type = req.query.type || "revenue";
    let result = [];
    if (type === "revenue") {
      result = await TransactionRepository.getRevenueTrend(artist, span);
    } else {
      result = await SongStreamRepository.getArtistSongStreamTrend(
        artist,
        span
      );
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTopGenre = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const artistId = artist._id;
    const topGenre = await ArtistRepository.topGenre(artistId);
    return res.status(200).json({ data: topGenre });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getStreamFavouritePurchase = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const artistId = artist._id;
    const topGenre = await ArtistRepository.topStreamFavouritePurchase(
      artistId
    );
    return res.status(200).json({ data: topGenre });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTopDonateUser = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const artistId = artist._id;
    const topGenre = await ArtistRepository.topDonateUser(artistId);
    return res.status(200).json({ data: topGenre });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCountFollower = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const artistId = artist._id;
    const topGenre = await ArtistRepository.topFollower(artistId);
    return res.status(200).json({ data: topGenre });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRevenueRatio = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const span = req.params.span || "weekly";
    const result = await TransactionRepository.getArtistRevenueRatio(
      artist,
      span
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getArtist5MostStreamSongs = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const artistId = artist._id;
    const span = req.params.span || "weekly";
    const result = await SongStreamRepository.get5MostStreamedSongsOfArtist(
      artistId,
      span
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getArtist5MostStreamSongsByAdmin = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const span = req.params.span || "weekly";
    const result = await SongStreamRepository.get5MostStreamedSongsOfArtist(
      artistId,
      span
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTrackPerformance = async (req, res) => {
  try {
    const decodedToken = req.decodedToken;
    const artist = await ArtistRepository.findArtistByUserId(
      decodedToken.userId
    );
    if (!artist) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const span = req.params.span || "weekly";
    const result = await SongRepository.getTrackPerformance(artist, span);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getArtistStatisticByAdmin = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const date = req.params.span;
    const sale = await TransactionRepository.getArtistTotalIncomeByAdmin({
      artistId: new mongoose.Types.ObjectId(artistId),
      date,
    });
    console.log("sale:", sale);
    const songStream = await SongStreamRepository.getArtistSongStreamByAdmin({
      artistId: new mongoose.Types.ObjectId(artistId),
      date,
    });
    const follower = await ArtistRepository.getArtistFollowerByAdmin({
      artistId: new mongoose.Types.ObjectId(artistId),
      date,
    });
    const artistImage = await ArtistRepository.getArtstImage({artistId: new mongoose.Types.ObjectId(artistId)})
    return res.status(200).json({
      data: {
        sale: sale,
        followers: follower,
        streamTime: songStream,
        image: artistImage
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getArtistRetioIncomeByAdmin = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const date = req.params.span || "weekly";
    const result = await TransactionRepository.getArtistRetioIncomeByAdmin({
      artistId,
      date,
    });
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createArtistByAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      introduction,
      profile_picture,
      artist_name,
      account_number,
      account_holder,
    } = req.body;
    const result = await ArtistRepository.createArtistByAdmin({
      first_name,
      last_name,
      email,
      introduction,
      profile_picture,
      artist_name,
      account_number,
      account_holder,
      role: 'artist'
    });
    return res.status(200).json({ message: "Create artist successfully!", data: result });
  } catch (error) {
    return res.status(500).json({ error: "Emails, Name of artist cannot be duplicates and information fields cannot be empty" });
  }
};

const getAllArtistLable = async (req,res) => {
  try {
    const result = await ArtistRepository.getAllArtistLable()
    return res.status(200).json({data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default {
  findByName,
  searchArtistByName,
  getRisingArtist,
  getAllHotArtist,
  getArtistInfo,
  getStatistic,
  getSongStreamOrRevenueTrend,
  getTopGenre,
  getStreamFavouritePurchase,
  getTopDonateUser,
  getCountFollower,
  getRevenueRatio,
  getTrackPerformance,
  getArtist5MostStreamSongs,
  getArtist5MostStreamSongsByAdmin,
  getArtistStatisticByAdmin,
  getArtistRetioIncomeByAdmin,
  createArtistByAdmin,
  getAllArtistLable
};
