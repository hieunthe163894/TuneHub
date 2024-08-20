import mongoose from "mongoose";
import Album from "../model/Album.js";
import Artist from "../model/Artist.js";
import Song from "../model/Song.js";
import User from "../model/RegisteredUser.js";
import Transaction from "../model/Transaction.js";
const createAlbum = async ({
  artist,
  album_name,
  songs,
  description,
  album_cover,
  price,
  background,
}) => {
  try {
    const result = await Album.create({
      artist,
      album_name,
      songs,
      description,
      album_cover,
      price,
      background,
    });
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAlbumsOfArtists = async (artistId) => {
  try {
    const result = await Album.find(
      { artist: artistId, is_public: true },
      "createdAt _id album_cover album_name description"
    ).populate("artist", "_id artist_name");
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getHotestAlbums = async () => {
  try {
    const result = await Album.aggregate([
      {
        $addFields: {
          totalPurchases: { $sum: "$purchases" },
        },
      },
      {
        $sort: { totalPurchases: -1 },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAlbumById = async (id) => {
  try {
    // const album = await Album.findById(id).populate("artist", "artist_name").select("_id album_cover album_name songs description price is_public");
    const album = await Album.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },

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
          album_cover: 1,
          album_name: 1,
          description: 1,
          price: 1,
          is_public: 1,
          artist_name: { $arrayElemAt: ["$artist.artist_name", 0] },
          artist_id: { $arrayElemAt: ["$artist._id", 0] },
          song_count: { $size: "$songs" },
          background: 1,
          createdAt: 1
          // songs:1
        },
      },
    ]);
    return album;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllAlbums = async () => {
  try {
    const albums = await Album.find({}).select(
      "_id artist album_name description album_cover"
    );
    return albums;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFilterAlbumByArtist = async ({ userId, sort, date }) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    const artist = await Artist.findOne({ userId: userId });
    if (!artist) {
      throw new Error("Artist not found for the given userId");
    }
    const artistId = artist._id;

    let sortFilter = {};
    const now = new Date();
    let dateFilter = {};

    switch (sort) {
      case "streamCount":
        sortFilter = {
          totalStreams: -1,
        };
        break;
      case "date":
        sortFilter = {
          createdAt: -1,
        };
        break;
      case "revenue":
        sortFilter = {
          totalRevenue: -1,
        };
        break;
    }

    switch (date) {
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
      case "alltime": {
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()),
          $lte: now,
        };
        break;
      }
    }

    const albums = await Album.aggregate([
      {
        $lookup: {
          from: "SongStream",
          localField: "songs._id",
          foreignField: "song",
          as: "streams",
        },
      },
      {
        $match: {
          artist: artistId,
          "streams.createdAt": dateFilter,
        },
      },
      {
        $addFields: {
          songStreamsCount: {
            $map: {
              input: "$songs",
              as: "song",
              in: {
                $let: {
                  vars: {
                    songId: "$$song._id",
                  },
                  in: {
                    _id: "$$songId",
                    count: {
                      $size: {
                        $filter: {
                          input: "$streams",
                          as: "stream",
                          cond: { $eq: ["$$stream.song", "$$songId"] },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          highStreamSong: {
            $arrayElemAt: [
              {
                $filter: {
                  input: {
                    $slice: [
                      {
                        $sortArray: {
                          input: "$songStreamsCount",
                          sortBy: { count: -1 },
                        },
                      },
                      1,
                    ],
                  },
                  as: "songStream",
                  cond: { $gt: ["$$songStream.count", 0] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "Song",
          localField: "highStreamSong._id",
          foreignField: "_id",
          as: "highStreamSongDetails",
        },
      },
      {
        $addFields: {
          highStreamSongDetails: {
            $arrayElemAt: ["$highStreamSongDetails", 0],
          },
          totalStreams: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$streams",
                    as: "stream",
                    cond: {
                      $and: [
                        { $gte: ["$$stream.createdAt", dateFilter.$gte] },
                        { $lte: ["$$stream.createdAt", dateFilter.$lte] },
                      ],
                    },
                  },
                },
                as: "stream",
                in: 1, // Each filtered stream contributes a count of 1
              },
            },
          },
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
        $project: {
          album_name: 1,
          album_cover: 1,
          artist: 1,
          description: 1,
          price: 1,
          is_public: 1,
          highStreamSong: "$highStreamSongDetails",
          totalStreams: 1,
          createdAt: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: sortFilter,
      },
    ]);

    return albums;
  } catch (error) {
    throw new Error(error.message);
  }
};

const disableEnableAlbum = async ({ albumId, status }) => {
  try {
    const album = await Album.findById(albumId);
    if (!album) {
      throw new Error("Album not found");
    }
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { is_public: !album.is_public },
      { new: true }
    );

    await Song.updateMany({ album: albumId }, { is_public: status });

    return updatedAlbum;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateAlbumById = async ({ albumChange }) => {
  try {
    const ab = await Album.findById(albumChange._id);
    if (!ab) {
      throw new Error("Album not found");
    }
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumChange._id,
      {
        album_name: albumChange.album_name,
        description: albumChange.description,
        album_cover: albumChange.album_cover,
        price: albumChange.price,
      },
      { new: true }
    );

    return updatedAlbum;
  } catch (error) {
    throw new Error(error.message);
  }
};

const buyAlbumByUser = async ({ albumId, userId }) => {
  try {
    const album = await Album.findById(albumId).exec();
    const user = await User.findById(userId).exec();
    if (!user || !album) {
      throw new Error("User, Album not found");
    }

    //cap nhap model album
    await album
      .updateOne({
        $addToSet: { purchasers: userId },
      })
      .exec();

    //cap nhap model song
    const songs = await Song.find({ album: albumId });
    for (const song of songs) {
      await song
        .updateOne({
          $addToSet: {
            purchased_user: {
              user: userId,
            },
          },
        })
        .exec();
    }

    //cap nhap modal user
    const songIds = songs.map((song) => song._id);
    await user
      .updateOne({
        $addToSet: {
          songs_purchased: { $each: songIds },
          albums_purchased: albumId,
        },
      })
      .exec();

    //cap nhap modal transaction
    const transaction = await Transaction.create({
      user: userId,
      seller: album.artist,
      transactionType: "album",
      amount: album.price,
      goodsId: album._id,
    });

    return transaction;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserPurchasedAlbum = async ({ userId }) => {
  const user = await User.findById(userId);

  const result = await Album.find({
    _id: {
      $in: user.albums_purchased,
    },
    is_public: true
  }).populate("artist", "_id artist_name");
  return result;
};

export default {
  createAlbum,
  getAlbumsOfArtists,
  getAlbumById,
  getAllAlbums,
  getHotestAlbums,
  getFilterAlbumByArtist,
  disableEnableAlbum,
  updateAlbumById,
  buyAlbumByUser,
  getUserPurchasedAlbum
};
