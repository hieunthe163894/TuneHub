import mongoose from "mongoose";
import User from "../model/RegisteredUser.js";
import Artist from "../model/Artist.js";
import Playlist from "../model/Playlist.js";
import moment from "moment";
import Song from "../model/Song.js";
import Album from "../model/Album.js";

const findById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const upgradeToArtist = async (userId) => {
  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: {
        role: "artist",
      },
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateProfile = async (
  id,
  { firstName, lastName, introduction, profilePicture }
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        first_name: firstName,
        last_name: lastName,
        introduction: introduction,
        profile_picture: profilePicture,
      },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
const addSongPurchased = async (userId, songId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { songs_purchased: new mongoose.Types.ObjectId(songId) },
      },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const followArtist = async ({ artistId, userId }) => {
  try {
    const user = await User.findById(userId);
    const isFollowed = user.artist_followed.includes(artistId);
    let registerUser;
    if (!isFollowed) {
      registerUser = await User.findByIdAndUpdate(userId, {
        $push: { artist_followed: new mongoose.Types.ObjectId(artistId) },
      });
      await Artist.findByIdAndUpdate(artistId, {
        $push: { followers: { userId: new mongoose.Types.ObjectId(userId) } },
      });
    } else {
      registerUser = await User.findByIdAndUpdate(userId, {
        $pull: { artist_followed: artistId },
      });
      await Artist.findByIdAndUpdate(artistId, {
        $pull: { followers: { userId: userId } },
      });
    }
    return registerUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkArtistFollowed = async ({ artistId, userId }) => {
  try {
    const registerUser = await User.findById(userId);
    if (registerUser) {
      const isFollowed = registerUser.artist_followed.includes(artistId);
      return isFollowed;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
const getListArtistFollowed = async (id) => {
  try {
    const listArtistFollowed = User.findOne({ _id: id }).select(
      "artist_followed"
    );
    return listArtistFollowed;
  } catch (error) {
    throw new Error(error.message);
  }
};
async function getInforArtistFollowed(artistFollowed) {
  try {
    const artists = await Artist.find({ _id: { $in: artistFollowed } })
      .populate({
        path: "userId",
        select: "introduction profile_picture",
      })
      .select("_id artist_name");
    const formattedArtists = artists.map((artist) => ({
      _id: artist._id,
      artist_name: artist.artist_name,
      userIdOfArtist: artist.userId._id,
      introduction: artist.userId.introduction,
      profile_picture: artist.userId.profile_picture,
    }));
    return formattedArtists;
  } catch (error) {
    throw new Error(error.message);
  }
}
const getListPlayList = async (userId) => {
  try {
    const playlists = await Playlist.find({ creator: userId })
      .select("-songs")
      .exec();
    const formattedPlaylists = playlists.map((playlist) => ({
      ...playlist.toObject(),
      // createdAt: moment(playlist.createdAt).format('DD/MM/yyyy hh:mm:ss A')
      createdAt: moment(playlist.createdAt).format("DD/MM/yyyy"),
    }));

    return formattedPlaylists;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getListFavouritedSong = async (userId) => {
  try {
    const favouritedSongs = await Song.find({ favourited: userId })
      .populate("album artist")
      .select("_id song_name genre file_name cover_image artist duration");
    return favouritedSongs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllUser = async () => {
    try {
        const allUser = await User.aggregate([
            {
                $lookup: {
                    from: "Comment",
                    localField: "_id",
                    foreignField: "user",
                    as: "comment",
                },
            },
            {
                $unwind: {
                    path: "$comment",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $lookup: {
                    from: "Report",
                    localField: "comment._id",
                    foreignField: "id_reported",
                    as: "report",
                },
            },
            {
                $unwind: {
                    path: "$report",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        first_name: "$first_name",
                        last_name: "$last_name",
                        email: "$email",
                        verify: "$verify",
                        role: "$role",
                        active: "$active",
                        createdAt: "$createdAt"
                    },
                    total_reports: { $sum: { $cond: [{ $gt: ["$report", null] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    first_name: "$_id.first_name",
                    last_name: "$_id.last_name",
                    email: "$_id.email",
                    verify: "$_id.verify",
                    role: "$_id.role",
                    active: "$_id.active",
                    createdAt: "$_id.createdAt",
                    total_reports: 1,
                }
            },
            {
                $sort: {
                    total_reports: -1
                }
            }
        ]
        );
        return allUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const banAccount = async (id, active) => {
    try {
        const updatedAccount = await User.findByIdAndUpdate(
            id,
            { active: active },
            { new: true }
        );
        return updatedAccount;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    findById,
    updateProfile,
    addSongPurchased,
    followArtist,
    checkArtistFollowed,
    getListArtistFollowed,
    getInforArtistFollowed,
    getListPlayList,
    getListFavouritedSong,
    getAllUser,
    banAccount,
    upgradeToArtist
};
