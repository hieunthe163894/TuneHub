import Song from "../model/Song.js";
import SongStreamRepository from "./songStream.js";
import mongoose from "mongoose";
import moment from "moment";
import Artist from "../model/Artist.js";
import Event from "../model/Event.js";
const getSongsByIds = async (songId) => {
  return await Song.aggregate([
    { $match: { _id: songId } },
    {
      $lookup: {
        from: "Album",
        localField: "album",
        foreignField: "_id",
        as: "album",
      },
    },
    {
      $lookup: {
        from: "Artist",
        localField: "artist",
        foreignField: "_id",
        as: "artist",
      },
    },
    {
      $project: {
        _id: 1,
        song_name: 1,
        is_exclusive: 1,
        album: {
          $arrayElemAt: [
            {
              $map: {
                input: "$album",
                in: {
                  _id: "$$this._id",
                  // artist: "$$this.artist",
                  album_name: "$$this.album_name",
                },
              },
            },
            0,
          ],
        },

        cover_image: 1,
        artist: {
          $arrayElemAt: [
            {
              $map: {
                input: "$artist",
                in: { _id: "$$this._id", artist_name: "$$this.artist_name" },
              },
            },
            0,
          ],
        },
        duration: 1,
      },
    },
    { $limit: 1 },
  ]);
};

const getAllSongs = async () => {
  try {
    const songList = await Song.find({ is_public: true })
      .populate("artist", "_id artist_name")
      .populate("album", "_id album_name")
      .select("_id price")
      .select("song_name")
      .select("cover_image")
      .select("duration")
      .select("is_exclusive")
      .select("file_name");
    return songList;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getSongsByAlbum = async (album) => {
  try {
    const songList = await Song.find({ album, is_public: true })
      .populate("artist", "_id artist_name")
      .populate("album", "_id album_name")
      .select("_id")
      .select("song_name")
      .select("cover_image")
      .select("duration")
      .select("is_exclusive")
      .select("price");
    return songList;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSongByAlbumByArtist = async (album) => {
  try {
    const songList = await Song.find({ album })
      .populate("artist", "_id artist_name")
      .populate("album", "_id album_name")
      .select("_id")
      .select("song_name")
      .select("cover_image")
      .select("duration")
      .select("is_exclusive")
      .select("is_public")
      .select("price");
    return songList;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getSongsByIdAgg = async (songId) => {
  try {
    const existingSong = await Song.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(songId), is_public: true },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $unwind: "$artist",
      },
      {
        $lookup: {
          from: "Genre",
          localField: "genre",
          foreignField: "_id",
          as: "genre",
        },
      },
      {
        $unwind: {
          path: "$genre",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Event",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: {
          path: "$event",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          participated_artist: {
            $ifNull: ["$participated_artist", []],
          },
        },
      },
      {
        $lookup: {
          from: "Artist",
          let: {
            participatedArtists: "$participated_artist",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$participatedArtists"],
                },
              },
            },
          ],
          as: "participated_artists_details",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "participated_artists_details.userId",
          foreignField: "_id",
          as: "participated_artists_users",
        },
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          genre: 1,
          price: 1,
          is_exclusive: 1,
          cover_image: 1,
          "artist._id": 1,
          "artist.artist_name": 1,
          favourited: 1,
          "participated_artists_details._id": 1,
          "participated_artists_details.artist_name": 1,
          "participated_artists_users.profile_picture": 1,
          "participated_artists_users.introduction": 1,
          event: 1,
          createdAt: 1,
        },
      },
    ]).exec();
    return existingSong;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSongsById = async ({ songId }) => {
  try {
    const existingSong = await Song.findById(songId)
      .populate("participated_artist", "_id artist_name")
      .populate("album")
      .exec();
    return existingSong;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserPurchasedSongs = async ({ purchasedSongs }) => {
  const result = await Song.find({
    _id: {
      $in: purchasedSongs,
    },
  })
    .populate("album", "_id album_name")
    .populate("artist", "_id artist_name")
    .populate("participated_artist", "_id artist_name");
  return result;
};
const getSongById = async ({ songId }) => {
  try {
    const existingSong = await Song.findById(songId)
      .populate("artist")
      .populate("album")
      .populate("genre")
      .populate("participated_artist")
      .exec();
    return existingSong;
  } catch (error) {
    throw new Error(error.message);
  }
};

const streamSong = async (songId, userId) => {
  try {
    const songStream = await SongStreamRepository.addSongStreamm({
      userId: userId,
      songId: songId,
    });
    return songStream;
  } catch (error) {
    throw new Error(error.message);
  }
};

const addFavouriteSong = async ({ songId, userId }) => {
  try {
    const favourited = await Song.findByIdAndUpdate(
      songId,
      {
        $push: { favourited: userId },
      },
      { new: true }
    );
    return favourited;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeFavouriteSong = async ({ songId, userId }) => {
  try {
    const favourited = await Song.findByIdAndUpdate(
      songId,
      {
        $pull: { favourited: userId },
      },
      { new: true }
    );
    return favourited;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getPopularSongOfArtist = async (artistId) => {
  try {
    const result = await Song.aggregate([
      {
        $match: {
          artist: new mongoose.Types.ObjectId(artistId),
          is_public: true,
        },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streamTime",
        },
      },
      {
        $addFields: {
          streamCount: {
            $size: "$streamTime",
          },
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $unwind: {
          path: "$artist",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album",
        },
      },
      {
        $unwind: {
          path: "$album",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          artist: {
            _id: "$artist._id",
            artist_name: "$artist.artist_name",
          },
          participated_artist: 1,
          is_exclusive: 1,
          duration: 1,
          cover_image: 1,
          album: {
            id: "$album._id",
            album_name: "$album.album_name",
          },
          streamCount: 1,
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const uploadSong = async ({
  song_name,
  genre,
  participated_artist,
  isExclusive,
  price,
  album,
  file_name,
  preview_start_time,
  preview_end_time,
  cover_image,
  artist,
  duration,
  isPublic,
}) => {
  console.log(isPublic);
  try {
    const result = await Song.create({
      song_name,
      genre,
      participated_artist,
      is_exclusive: isExclusive,
      price,
      album,
      file_name,
      preview_start_time,
      preview_end_time,
      cover_image,
      artist: artist,
      duration,
      is_public: isPublic,
    });
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};
const searchSongByName = async (name) => {
  try {
    const foundSongs = await Song.aggregate([
      {
        $match: { song_name: { $regex: name, $options: "i" }, is_public: true },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streamTime",
        },
      },
      {
        $addFields: {
          lastStreamTime: { $max: "$streamTime.createdAt" },
        },
      },
      {
        $addFields: {
          streamCount: { $size: "$streamTime" },
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist_file",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "artist_file.userId",
          foreignField: "_id",
          as: "users_file",
        },
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album_file",
        },
      },
      {
        $group: {
          _id: "$_id",
          song_name: { $first: "$song_name" },
          is_exclusive: { $first: "$is_exclusive" },
          album: {
            $first: {
              _id: { $arrayElemAt: ["$album_file._id", 0] },
              artist: { $arrayElemAt: ["$album_file.artist", 0] },
              album_name: { $arrayElemAt: ["$album_file.album_name", 0] },
              album_cover: { $arrayElemAt: ["$album_file.album_cover", 0] },
            },
          },
          artist: {
            $first: {
              _id: { $arrayElemAt: ["$artist_file._id", 0] },
              artist_name: { $arrayElemAt: ["$artist_file.artist_name", 0] },
            },
          },
          duration: { $first: "$duration" },
          cover_image: { $first: "$cover_image" },
          streamCount: { $first: "$streamCount" },
          lastStreamTime: { $first: "$lastStreamTime" },
          favourited: {
            $first: "$favourited",
          },
        },
      },
      {
        $project: {
          _id: "$_id",
          song_name: "$song_name",
          is_exclusive: "$is_exclusive",
          album: "$album",
          artist: "$artist",
          duration: "$duration",
          cover_image: "$cover_image",
          streamCount: "streamCount",
          lastStreamTime: "$lastStreamTime",
          favourited: "$favourited",
        },
      },
      {
        $sort: { streamCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $sort: { lastStreamTime: -1 },
      },
    ]).exec();

    // if (foundSongs.length === 0) {
    //   throw new Error("No songs found with the provided name");
    // }

    return foundSongs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const hotestSongByDay = async (date, check) => {
  try {
    const byDay = new Date(new Date() - 24 * date * 60 * 60 * 1000);
    let aggregationPipeline = [
      {
        $match: {
          is_public: true,
        },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streamTime",
        },
      },
      {
        $unwind: {
          path: "$streamTime",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: ["$streamTime.createdAt", byDay],
                  },
                  {
                    $lt: ["$streamTime.createdAt", new Date()],
                  },
                ],
              },
              then: 1,
              else: 0,
            },
          },
          lastStreamTime: {
            $max: "$streamTime.createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist_file",
        },
      },
      {
        $unwind: "$artist_file",
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album_file",
        },
      },
      {
        $unwind: {
          path: "$album_file",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "participated_artist",
          foreignField: "_id",
          as: "participated_artists",
        },
      },
      {
        $unwind: {
          path: "$participated_artists",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          song_name: { $first: "$song_name" },
          album: {
            $first: {
              _id: "$album_file._id",
              album_name: "$album_file.album_name",
            },
          },
          artist: {
            $first: {
              _id: "$artist_file._id",
              artist_name: "$artist_file.artist_name",
            },
          },
          cover_image: { $first: "$cover_image" },
          streamCount: { $sum: "$count" },
          duration: { $first: "$duration" },
          is_exclusive: { $first: "$is_exclusive" },
          lastStreamTime: {
            $first: "$lastStreamTime",
          },
          participated_artists: {
            $addToSet: {
              _id: "$participated_artists._id",
              artist_name: "$participated_artists.artist_name",
            },
          },
          favourited: {
            $first: "$favourited",
          },
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          album: 1,
          artist: 1,
          cover_image: 1,
          streamCount: 1,
          duration: 1,
          is_exclusive: 1,
          lastStreamTime: 1,
          participated_artists: 1,
          favourited: 1,
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
    ];

    if (check !== "all") {
      aggregationPipeline.unshift({
        $match: {
          is_exclusive: check === "true" ? true : false,
        },
      });
    }

    const results = await Song.aggregate(aggregationPipeline).exec();
    return results;
  } catch (error) {
    console.error("Error in hotestSongByDay:", error);
    throw error;
  }
};
const hotestSongByDay1 = async (date, check) => {
  try {
    const byDay = new Date(new Date() - 24 * date * 60 * 60 * 1000);
    let aggregationPipeline = [
      {
        $match: {
          is_public: true,
        },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streamTime",
        },
      },
      {
        $unwind: {
          path: "$streamTime",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: {
                $and: [
                  {
                    $gte: ["$streamTime.createdAt", byDay],
                  },
                  {
                    $lt: ["$streamTime.createdAt", new Date()],
                  },
                ],
              },
              then: 1,
              else: 0,
            },
          },
          lastStreamTime: {
            $max: "$streamTime.createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist_file",
        },
      },
      {
        $unwind: "$artist_file",
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album_file",
        },
      },
      {
        $unwind: {
          path: "$album_file",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "participated_artist",
          foreignField: "_id",
          as: "participated_artists",
        },
      },
      {
        $unwind: {
          path: "$participated_artists",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          song_name: { $first: "$song_name" },
          album: {
            $first: {
              _id: "$album_file._id",
              album_name: "$album_file.album_name",
            },
          },
          artist: {
            $first: {
              _id: "$artist_file._id",
              artist_name: "$artist_file.artist_name",
            },
          },
          cover_image: { $first: "$cover_image" },
          streamCount: { $sum: "$count" },
          duration: { $first: "$duration" },
          is_exclusive: { $first: "$is_exclusive" },
          lastStreamTime: {
            $first: "$lastStreamTime",
          },
          participated_artists: {
            $addToSet: {
              _id: "$participated_artists._id",
              artist_name: "$participated_artists.artist_name",
            },
          },
          favourited: {
            $first: "$favourited",
          },
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          album: 1,
          artist: 1,
          cover_image: 1,
          streamCount: 1,
          duration: 1,
          is_exclusive: 1,
          lastStreamTime: 1,
          participated_artists: 1,
          favourited: 1,
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
      {
        $limit: 5,
      },
    ];

    if (check !== "all") {
      aggregationPipeline.unshift({
        $match: {
          is_exclusive: check === "true" ? true : false,
        },
      });
    }

    const results = await Song.aggregate(aggregationPipeline).exec();
    return results;
  } catch (error) {
    console.error("Error in hotestSongByDay:", error);
    throw error;
  }
};

const hotestSong = async () => {
  try {
    const results = await Song.aggregate([
      {
        $match: {
          is_public: true,
        },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streamTime",
        },
      },
      {
        $unwind: {
          path: "$streamTime",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: {
                $lt: ["$streamTime.createdAt", new Date()],
              },
              then: 1,
              else: 0,
            },
          },
          lastStreamTime: {
            $max: "$streamTime.createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist_file",
        },
      },
      {
        $unwind: "$artist_file",
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album_file",
        },
      },
      {
        $unwind: {
          path: "$album_file",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "participated_artist",
          foreignField: "_id",
          as: "participated_artists",
        },
      },
      {
        $unwind: {
          path: "$participated_artists",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          song_name: { $first: "$song_name" },
          album: {
            $first: {
              _id: "$album_file._id",
              album_name: "$album_file.album_name",
            },
          },
          artist: {
            $first: {
              _id: "$artist_file._id",
              artist_name: "$artist_file.artist_name",
            },
          },
          cover_image: { $first: "$cover_image" },
          streamCount: { $sum: "$count" },
          duration: { $first: "$duration" },
          is_exclusive: { $first: "$is_exclusive" },
          lastStreamTime: {
            $first: "$lastStreamTime",
          },
          participated_artists: {
            $addToSet: {
              _id: "$participated_artists._id",
              artist_name: "$participated_artists.artist_name",
            },
          },
          favourited: {
            $first: "$favourited",
          },
        },
      },
      {
        $sort: {
          streamCount: -1,
        },
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          album: 1,
          artist: 1,
          cover_image: 1,
          streamCount: 1,
          duration: 1,
          is_exclusive: 1,
          lastStreamTime: 1,
          participated_artists: 1,
          favourited: 1,
        },
      },
      {
        $limit: 15,
      },
    ]).exec();
    return results;
  } catch (error) {
    console.error("Error in hotestSongByDay:", error);
    throw error;
  }
};

const getUnPublishedSongOfArtist = async (artistId) => {
  try {
    const unPublishedSongs = await Song.find(
      {
        artist: artistId,
        is_public: false,
      },
      "_id song_name cover_image duration price artist"
    );
    return unPublishedSongs;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getFeaturedSongs = async (artistId) => {
  try {
    const result = await Song.find(
      {
        participated_artist: {
          $in: [artistId],
        },
      },
      "_id song_name participated_artist is_exclusive preview_start_time preview_end_time cover_image artist duration album"
    )
      .populate("participated_artist", "_id artist_name")
      .populate("artist", "_id artist_name")
      .populate("album", "_id album_name");
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const makePublic = async ({ songIds, album }) => {
  try {
    const result = await Song.updateMany(
      { _id: { $in: songIds } },
      {
        $set: {
          is_public: true,
          album: album,
        },
      }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const addPurchaser = async (userId, songId) => {
  try {
    const result = await Song.findByIdAndUpdate(
      songId,
      {
        $push: {
          purchased_user: {
            user: userId,
          },
        },
      },
      { new: true }
    ).populate("artist", "artist_name");
    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getLatestSongs = async (limit, songType, songName) => {
  let filter = {};
  if (songName) {
    filter.song_name = new RegExp(songName, "i");
  }
  if (songType === "Exclusive") {
    filter.is_exclusive = true;
  } else if (songType === "Free") {
    filter.is_exclusive = false;
  }
  filter.is_public = true;
  try {
    const result = await Song.find(filter)
      .populate("artist", "_id artist_name")
      .populate("album", "_id album_name")
      .select("_id price")
      .select("song_name")
      .select("cover_image")
      .select("duration")
      .select("is_exclusive")
      .select("file_name createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSongByGenre = async ({ limit, songType, genreId, songName }) => {
  try {
    // if (songType === "Exclusive") {
    //   filter = true;
    // } else if (songType === "Free") {
    //   filter = false;
    // } else {
    //   const foundSongs = await Song.aggregate([

    //     {
    //       $match: {
    //         genre: new mongoose.Types.ObjectId(genreId),
    //         is_public: true,
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "SongStream",
    //         localField: "_id",
    //         foreignField: "song",
    //         as: "streamTime",
    //       },
    //     },
    //     {
    //       $addFields: {
    //         lastStreamTime: { $max: "$streamTime.createdAt" },
    //       },
    //     },
    //     {
    //       $addFields: {
    //         streamCount: { $size: "$streamTime" },
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "Artist",
    //         localField: "artist",
    //         foreignField: "_id",
    //         as: "artist_file",
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "Users",
    //         localField: "artist_file.userId",
    //         foreignField: "_id",
    //         as: "users_file",
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "Album",
    //         localField: "album",
    //         foreignField: "_id",
    //         as: "album_file",
    //       },
    //     },
    //     {
    //       $group: {
    //         _id: "$_id",
    //         song_name: { $first: "$song_name" },
    //         is_exclusive: { $first: "$is_exclusive" },
    //         album: {
    //           $first: {
    //             _id: { $arrayElemAt: ["$album_file._id", 0] },
    //             artist: { $arrayElemAt: ["$album_file.artist", 0] },
    //             album_name: { $arrayElemAt: ["$album_file.album_name", 0] },
    //             album_cover: { $arrayElemAt: ["$album_file.album_cover", 0] },
    //           },
    //         },
    //         artist: {
    //           $first: {
    //             _id: { $arrayElemAt: ["$artist_file._id", 0] },
    //             artist_name: { $arrayElemAt: ["$artist_file.artist_name", 0] },
    //           },
    //         },
    //         duration: { $first: "$duration" },
    //         cover_image: { $first: "$cover_image" },
    //         streamCount: { $first: "$streamCount" },
    //         lastStreamTime: { $first: "$lastStreamTime" },
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: "$_id",
    //         song_name: "$song_name",
    //         is_exclusive: "$is_exclusive",
    //         album: "$album",
    //         artist: "$artist",
    //         duration: "$duration",
    //         cover_image: "$cover_image",
    //         streamCount: "streamCount",
    //         lastStreamTime: "$lastStreamTime",
    //       },
    //     },
    //     {
    //       $sort: { streamCount: -1 },
    //     },
    //     {
    //       $limit: parseInt(limit),
    //     },
    //     {
    //       $sort: { lastStreamTime: -1 },
    //     },
    //   ]).exec();
    let filter = {
      is_public: true
    };
    filter.genre = new mongoose.Types.ObjectId(genreId);
    if (songName) {
      filter.song_name = new RegExp(songName, "i");
    }
    if (songType === "Exclusive") {
      filter.is_exclusive = true;
    }
    if (songType === "Free") {
      filter.is_exclusive = false;
    }
    const foundSongs = await Song.find(filter)
      .populate("artist", "_id artist_name")
      .populate("album", "_id album_name")
      .select("_id price")
      .select("song_name")
      .select("cover_image")
      .select("duration")
      .select("is_exclusive")
      .select("file_name createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);
    return foundSongs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkFavouriteSong = async ({ songId, userId }) => {
  try {
    const song = await Song.findById(songId);
    if (song) {
      const isLove = song.favourited.includes(
        new mongoose.Types.ObjectId(userId)
      );
      console.log(isLove);
      return isLove;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getStreamSongbyId = async (userId) => {
  try {
    const song = await Song.aggregate([
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "songStream",
        },
      },
      {
        $unwind: {
          path: "$songStream",
        },
      },
      {
        $match: {
          "songStream.user": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album",
        },
      },
      {
        $unwind: {
          path: "$album",
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $unwind: {
          path: "$artist",
        },
      },
      {
        $group: {
          _id: "$_id",
          cover_image: { $first: "$cover_image" },
          duration: { $first: "$duration" },
          song_name: { $first: "$song_name" },
          artist: { $first: "$artist" },
          album: { $first: "$album" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          cover_image: 1,
          duration: 1,
          song_name: 1,
          artist: 1,
          "album.album_name": 1,
          streamCount: { $sum: "$count" },
        },
      },
      {
        $sort: { streamCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);
    console.log(song);
    return song;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFilterSongByArtist = async ({ userId, date, sort }) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    let artistId = "";
    const artist = await Artist.findOne({ userId: userId });
    if (!artist) {
      artistId = userId;
    } else {
      artistId = artist._id;
    }

    const now = new Date();
    let dateFilter = {};
    let orderBy = {};
    let matchCondition = {
      artist: artistId,
    };
    let matchRevenue = {
      totalRevenue: { $ne: null },
    };

    switch (date) {
      case "weekly":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 6);
        dateFilter = {
          $gte: startOfWeek,
          $lte: now,
        };
        break;
      case "monthly":
      case "1month":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
          $lte: now,
        };
        break;
      case "3month":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
          $lte: now,
        };
        break;
      case "6month":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
          $lte: now,
        };
        break;
      case "alltime":
      case "allTime": {
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()),
          $lte: now,
        };
        break;
      }
    }

    switch (sort) {
      case "streamCount":
        orderBy = {
          streamCount: -1,
        };
        matchCondition["streamTime.createdAt"] = dateFilter;
        break;
      case "date":
        orderBy = {
          createdAt: -1,
        };
        matchCondition["streamTime.createdAt"] = dateFilter;
        break;
      case "revenue":
        orderBy = {
          totalRevenue: -1,
        };
        matchRevenue["totalRevenue"] = { $gt: 0 };
        //matchRevenue["transactions.createdAt"] = dateFilter;
        break;
    }

    const result = await Song.aggregate([
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "streamTime",
        },
      },
      {
        $unwind: {
          path: "$streamTime",
          // preserveNullAndEmptyArrays: true,
        },
      },
      //date filter all time dang loai mat mot so bai hat
      {
        $match: matchCondition,
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: {
                $lt: ["$streamTime.createdAt", new Date()],
              },
              then: 1,
              else: 0,
            },
          },
          lastStreamTime: {
            $max: "$streamTime.createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist_file",
        },
      },
      {
        $unwind: "$artist_file",
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album_file",
        },
      },
      {
        $unwind: {
          path: "$album_file",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "participated_artist",
          foreignField: "_id",
          as: "participated_artists",
        },
      },
      {
        $unwind: {
          path: "$participated_artists",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Transaction",
          localField: "_id",
          foreignField: "goodsId",
          as: "transactions",
        },
      },
      {
        $addFields: {
          totalRevenue: {
            $sum: "$transactions.amount",
          },
        },
      },
      {
        $match: matchRevenue,
      },
      {
        $group: {
          _id: "$_id",
          song_name: { $first: "$song_name" },
          totalRevenue: { $first: "$totalRevenue" },
          price: { $first: "$price" },
          album: {
            $first: {
              _id: "$album_file._id",
              album_name: "$album_file.album_name",
            },
          },
          artist: {
            $first: {
              _id: "$artist_file._id",
              artist_name: "$artist_file.artist_name",
            },
          },
          cover_image: { $first: "$cover_image" },
          streamCount: { $sum: "$count" },
          duration: { $first: "$duration" },
          is_exclusive: { $first: "$is_exclusive" },
          lastStreamTime: {
            $first: "$lastStreamTime",
          },
          participated_artists: {
            $addToSet: {
              _id: "$participated_artists._id",
              artist_name: "$participated_artists.artist_name",
            },
          },
          createdAt: {
            $first: "$createdAt",
          },
          is_public: {
            $first: "$is_public",
          },
          favourited: {
            $first: "$favourited",
          },
          active: {
            $first: "$active",
          },
        },
      },
      {
        $sort: orderBy,
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          album: 1,
          price: 1,
          artist: 1,
          cover_image: 1,
          streamCount: 1,
          duration: 1,
          is_exclusive: 1,
          lastStreamTime: 1,
          participated_artists: 1,
          favourited: 1,
          createdAt: 1,
          is_public: 1,
          totalRevenue: 1,
          active: 1,
        },
      },
      // {
      //   $limit: 15,
      // },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const removeEvents = async () => {
  try {
    const startOfDay = moment().utc().startOf("day").toISOString();
    const endOfDay = moment().utc().endOf("day").toISOString();
    const endingEvents = await Event.find(
      { eventDeadline: { $gte: startOfDay, $lte: endOfDay } },
      { _id: 1 } // Only select the _id field
    ).lean();
    console.log(endingEvents);
    const endingEventIds = endingEvents.map((event) => event._id);
    const result = await Song.updateMany(
      {
        event: {
          $in: endingEventIds,
        },
      },
      {
        $set: {
          event: null,
        },
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
const getTrackPerformance = async (artist, span) => {
  try {
    let filter = {};
    if (span === "weekly") {
      const startOfWeek = moment().startOf("isoWeek").toDate();
      const currentDate = moment().endOf("day").toDate();
      filter.createdAt = {
        $gte: startOfWeek,
        $lt: currentDate,
      };
    } else if (span === "monthly") {
      const startOfMonth = moment().startOf("month").toDate();
      const currentDate = moment().endOf("day").toDate();
      filter.createdAt = {
        $gte: startOfMonth,
        $lt: currentDate,
      };
    }
    const result = await Song.aggregate([
      {
        $match: {
          $and: [
            {
              artist: new mongoose.Types.ObjectId(artist._id),
            },
            // filter,
          ],
        },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "_id",
          foreignField: "song",
          as: "songStream",
        },
      },
      {
        $addFields: {
          streamCount: {
            $size: "$songStream",
          },
        },
      },
      {
        $lookup: {
          from: "Transaction",
          localField: "_id",
          foreignField: "goodsId",
          as: "purchase",
        },
      },
      {
        $addFields: {
          purchaseCount: {
            $size: "$purchase",
          },
        },
      },
      {
        $sort: {
          purchaseCount: -1,
        },
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          cover_image: 1,
          participated_artist: 1,
          is_exclusive: 1,
          album: 1,
          artist: 1,
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const disableEnableSong = async ({ songId }) => {
  try {
    const song = await Song.findById(songId);
    if (!song) {
      throw new Error("Song not found");
    }
    if (song.active == false) {
      throw new Error("This song has been locked by admin");
    }
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      { is_public: !song.is_public },
      { new: true }
    );

    return updatedSong;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getRelevantSong = async ({ genres, artistIds }) => {
  console.log(artistIds);
  const genresConverted = genres.map((g) => new mongoose.Types.ObjectId(g));
  const artistIdsConverted = artistIds.map(
    (a) => new mongoose.Types.ObjectId(a)
  );
  try {
    const result = await Song.aggregate([
      {
        $match: {
          is_public: true,
        },
      },
      {
        $addFields: {
          relevance: {
            $sum: [
              {
                $cond: [
                  {
                    $in: ["$genre", genresConverted],
                  },
                  1,
                  0,
                ],
              },
              {
                $cond: [
                  {
                    $in: ["$artist", artistIdsConverted],
                  },
                  1,
                  0,
                ],
              },
              {
                $size: {
                  $setIntersection: [
                    {
                      $ifNull: ["$participated_artist", []],
                    },
                    artistIdsConverted,
                  ],
                },
              },
            ],
          },
        },
      },
      {
        $sort: {
          relevance: -1,
        },
      },
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $unwind: "$artist",
      },
      {
        $lookup: {
          from: "Album",
          localField: "album",
          foreignField: "_id",
          as: "album",
        },
      },
      {
        $unwind: "$album",
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          song_name: 1,
          price: 1,
          is_exclusive: 1,
          file_name: 1,
          cover_image: 1,
          "artist._id": 1,
          "artist.artist_name": 1,
          duration: 1,
          "album._id": 1,
          "album.album_name": 1,
          relevance: 1,
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateSongById = async ({ songChange }) => {
  try {
    const song = await Song.findById(songChange._id);
    if (!song) {
      throw new Error("Song not found");
    }
    const updatedSong = await Song.findByIdAndUpdate(
      songChange._id,
      {
        song_name: songChange.song_name,
        genre: songChange.genre,
        participated_artist: songChange.participated_artist,
        is_exclusive: songChange.is_exclusive,
        is_public: songChange.is_public,
        price: songChange.price,
        cover_image: songChange.cover_image,
      },
      { new: true }
    );
    return updatedSong;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updatedSong = async ({
  songId,
  song_name,
  genre,
  featuredArtist,
  price,
  event,
}) => {
  try {
    console.log(event);
    let updateData = {
      song_name: song_name,
      genre: genre,
      participated_artist: featuredArtist,
      event: event,
    };
    if (price) {
      updateData.price = price;
    }
    const result = Song.findByIdAndUpdate(
      songId,
      {
        $set: updateData,
      },
      { new: true }
    );
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllSongAdmin = async () => {
  try {
    const songList = await Song.aggregate([
      {
        $lookup: {
          from: "Artist",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      {
        $unwind: {
          path: "$artist",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "artist.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "Report",
          localField: "_id",
          foreignField: "id_reported",
          as: "report",
        },
      },
      {
        $unwind: {
          path: "$report",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            song_name: "$song_name",
            cover_image: "$cover_image",
            artist: "$artist.artist_name",
            user: "$user.first_name",
            user_last_name: "$user.last_name",
            active: "$active",
            createdAt: "$createdAt",
          },
          total_reports: {
            $sum: {
              $cond: [{ $gt: ["$report", null] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: "$_id._id",
          song_name: "$_id.song_name",
          cover_image: "$_id.cover_image",
          artist: "$_id.artist",
          active: "$_id.active",
          user: {
            $concat: ["$_id.user", " ", "$_id.user_last_name"],
          },
          createdAt: "$_id.createdAt",
          total_reports: 1,
        },
      },
      {
        $sort: {
          total_reports: -1,
        },
      },
    ]);
    return songList;
  } catch (error) {
    throw new Error(error.message);
  }
};

const banSong = async (id, active) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      {
        active: active,
        is_public: active,
      },
      { new: true }
    );
    return updatedSong;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  getAllSongs,
  streamSong,
  getSongsById,
  uploadSong,
  searchSongByName,
  hotestSongByDay,
  getUnPublishedSongOfArtist,
  makePublic,
  getPopularSongOfArtist,
  getSongsByIds,
  getSongsByAlbum,
  getFeaturedSongs,
  hotestSong,
  addPurchaser,
  addFavouriteSong,
  removeFavouriteSong,
  getLatestSongs,
  getSongsByIdAgg,
  getSongByGenre,
  checkFavouriteSong,
  hotestSongByDay1,
  getStreamSongbyId,
  getFilterSongByArtist,
  getTrackPerformance,
  disableEnableSong,
  getSongByAlbumByArtist,
  getRelevantSong,
  getSongById,
  updateSongById,
  updatedSong,
  getUserPurchasedSongs,
  removeEvents,
  getAllSongAdmin,
  banSong,
};
