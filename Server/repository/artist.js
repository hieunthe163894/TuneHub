import Artist from "../model/Artist.js";
import song from "../model/Song.js";
import User from "../model/RegisteredUser.js";
import Transaction from "../model/Transaction.js";
import { mongo } from "mongoose";
import mongoose from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendMail } from "../utils/mailTransport.js";
import bcrypt from "bcrypt";
const findArtistByName = async ({ searchInput, artistId }) => {
  try {
    return await Artist.find({
      artist_name: { $regex: new RegExp(`.*${searchInput}.*`, "i") },
      _id: { $ne: artistId },
    }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};
const findArtistByNameExact = async (artistName) => {
  try {
    return await Artist.findOne({
      artist_name: { $regex: new RegExp(`^${artistName}$`, "i") },
    }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};
const findArtistByUserId = async (userId) => {
  try {
    return await Artist.findOne({ userId: userId }).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRisingArtist = async () => {
  try {
    const foundArtist = await Artist.aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "userId",
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
        $addFields: {
          artist_followed_count: { $size: "$followers" },
        },
      },
      {
        $sort: { artist_followed_count: -1 },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          _id: 1,
          artist_name: 1,
          "user.introduction": 1,
          "user.profile_picture": 1,
          artist_followed_count: 1,
        },
      },
    ]).exec();

    return foundArtist;
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchArtistByName = async (name) => {
  try {
    const foundArtist = await Artist.aggregate([
      {
        $match: {
          artist_name: { $regex: name, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
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
        $addFields: {
          artist_followed_count: { $size: "$followers" },
        },
      },
      {
        $sort: { artist_followed_count: -1 },
      },
      {
        $limit: 12,
      },
      {
        $project: {
          _id: 1,
          artist_name: 1,
          "user.introduction": 1,
          "user.profile_picture": 1,
          artist_followed_count: 1,
        },
      },
    ]).exec();

    // if (foundArtist.length == 0) {
    //   throw new Error("No artist found with the provided name");
    // }
    return foundArtist;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findByArtistId = async (artistId) => {
  try {
    const result = await Artist.findById(
      artistId,
      "_id artist_name followers userId"
    )
      .populate("userId", "profile_picture")
      .exec();
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};
const addSongUpload = async ({
  artistId,
  songId,
  songName,
  songCover,
  isExclusive,
}) => {
  try {
    Artist.findByIdAndUpdate(
      artistId,
      {
        $push: {
          song_uploads: {
            songId: songId,
            song_name: songName,
            song_cover: songCover,
            is_exclusive: isExclusive,
          },
        },
      },
      { new: true }
    ).exec();
  } catch (error) {
    throw new Error(error.message);
  }
};

const hotArtist = async () => {
  try {
    const result = await Artist.aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "artist_file",
        },
      },
      {
        $unwind: {
          path: "$artist_file",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          followers_count: {
            $cond: {
              if: { $isArray: "$followers" },
              then: { $size: "$followers" },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          id: 1,
          artist_name: 1,
          artist_file: {
            profile_picture: "$artist_file.profile_picture",
            introduction: "$artist_file.introduction",
          },
          followers_count: 1,
        },
      },
      {
        $sort: {
          followers_count: -1,
        },
      },
      { $limit: 15 },
    ]).exec();
    return result;
  } catch (error) {
    console.log(error.message);
  }
};
const makeAlbum = async ({
  artistId,
  albumId,
  album_name,
  album_cover,
  price,
}) => {
  const result = await Artist.findOneAndUpdate(
    {
      _id: artistId,
    },
    {
      $push: {
        albums: {
          albumId,
          album_name,
          album_cover,
          price,
        },
      },
    },
    { new: true }
  );
  return result;
};

const topGenre = async (artistId) => {
  try {
    const result = await Artist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(artistId),
        },
      },
      {
        $unwind: "$song_uploads",
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "song_uploads.songId",
          foreignField: "song",
          as: "songStreams",
        },
      },
      {
        $lookup: {
          from: "Song",
          localField: "song_uploads.songId",
          foreignField: "_id",
          as: "songDetail",
        },
      },
      {
        $unwind: "$songDetail",
      },
      {
        $unwind: {
          path: "$followers",
        },
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "followers.userId",
          foreignField: "user",
          as: "user_stream",
          pipeline: [
            {
              $lookup: {
                from: "Song",
                localField: "song",
                foreignField: "_id",
                as: "songDetail",
              },
            },
            {
              $unwind: {
                path: "$songDetail",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $lookup: {
                from: "Genre",
                localField: "songDetail.genre",
                foreignField: "_id",
                as: "songGenre",
              },
            },
            {
              $unwind: {
                path: "$songGenre",
                preserveNullAndEmptyArrays: false,
              },
            },
            {
              $project: {
                _id: 0,
                genre: "$songGenre.name",
                hasStream: {
                  $cond: {
                    if: {
                      $gt: ["$song", null],
                    },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$user_stream",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$user_stream.genre",
          stream_count: {
            $sum: "$user_stream.hasStream",
          },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          stream_count: 1,
        },
      },
    ]).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const topStreamFavouritePurchase = async (artistId) => {
  try {
    const result = await Artist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(artistId),
        },
      },
      {
        $unwind: "$song_uploads",
      },
      {
        $lookup: {
          from: "SongStream",
          localField: "song_uploads.songId",
          foreignField: "song",
          as: "songStreams",
        },
      },
      {
        $lookup: {
          from: "Song",
          localField: "song_uploads.songId",
          foreignField: "_id",
          as: "songDetail",
        },
      },
      {
        $unwind: "$songDetail",
      },
      {
        $project: {
          _id: 0,
          song_name: "$songDetail.song_name",
          stream_count: { $size: "$songStreams" },
          favourite_count: {
            $size: "$songDetail.favourited",
          },
          purchased_count: {
            $size: "$songDetail.purchased_user",
          },
        },
      },
    ]).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const topDonateUser = async (artistId) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          seller: new mongoose.Types.ObjectId(artistId),
          transactionType: "donate",
        },
      },
      {
        $group: {
          _id: "$user",
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "_id",
          foreignField: "_id",
          as: "user_detail",
        },
      },
      {
        $unwind: {
          path: "$user_detail",
        },
      },
      {
        $project: {
          _id: 0,
          first_name: "$user_detail.first_name",
          last_name: "$user_detail.last_name",
          totalAmount: 1,
        },
      },
      {
        $sort: {
          totalAmount: -1,
        },
      },
      {
        $limit: 3,
      },
    ]).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const topFollower = async (artistId) => {
  try {
    const result = await Artist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(artistId),
        },
      },
      {
        $unwind: "$followers",
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$followers.createdAt",
            },
          },
          totalFollowers: { $sum: 1 },
          createdAtArray: { $push: "$createdAt" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalFollowers: 1,
          createdAt: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $arrayElemAt: ["$createdAtArray", 0],
              },
            },
          },
        },
      },
      {
        $sort: {
          date: -1,
        },
      },
    ]).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getArtistFollowerByAdmin = async ({ artistId, date }) => {
  try {
    const now = new Date();
    let dateFilter = {};
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
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
          $lte: now,
        };
        break;
      case "allTime": {
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth() - 12, now.getDate()),
          $lte: now,
        };
        break;
      }
    }

    const result = await Artist.aggregate([
      { $match: { _id: artistId } },
      { $unwind: "$followers" },
      {
        $match: {
          "followers.createdAt": dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          followerCount: { $sum: 1 },
        },
      },
    ]);

    return result[0] ? result[0].followerCount : 0;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createArtistByAdmin = async ({
  first_name,
  last_name,
  email,
  introduction,
  profile_picture,
  artist_name,
  account_number,
  account_holder,
  role,
}) => {
  try {
    const plainPassword = crypto.randomBytes(8).toString("hex").slice(0, 8);
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUND));
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);

    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      introduction: introduction,
      profile_picture: profile_picture,
      role: role,
      password: hashedPassword,
      verify: true
    });
    const artist = await Artist.create({
      artist_name: artist_name,
      userId: user._id,
      account_number: account_number,
      account_holder: account_holder,
    });

    const mailOptions = {
      to: email,
      subject: "Welcome to TuneHub",
      text: `Dear ${artist_name}, your password is ${plainPassword}`,
      html: `
      <div style="display:flex;justify-content:center;margin-left:4em;">
      <div>
          <div style="background-color: #ff5e3a;border-radius: 10px 10px 0 0; padding: 5px;"></div>
          <div style="background-color: #fff; padding: 10px;">
              <h2 style="text-align:center">Welcome <strong>${artist_name}</strong> to TuneHub</h2>
              <p>Dear ${artist_name},</p>
              <p>Your password for your account is: <strong>${plainPassword}</strong></p>
              <p>We are thrilled to have you join our community of talented artists. At TuneHub, we believe in the power of music to inspire and connect people around the world, and we are excited to see how your unique sound will contribute to our diverse and vibrant platform.</p>
              <p>As a member of TuneHub, you'll have access to a wide range of tools and resources to help you share your music, engage with fans, and grow your audience. Whether you're uploading new tracks, creating playlists, or collaborating with other artists, we're here to support you every step of the way.</p>
              <p>Thank you for choosing TuneHub as your musical home. We can't wait to hear your amazing music and watch your career flourish.</p>
              <p>Welcome aboard!</p>
              <p>Best regards,</p>
              <p>The TuneHub Team</p>
              <button style="border:none;border-radius: 5px;padding:5px 10px;margin-left:13em;background-color: #ff5e3a;color:white; text-align: center;cursor:pointer"><p style="margin:0">Click <a href="http://localhost:3000/login" style="text-decoration-line: none;color:white;">here</a> to login.</p></div>
              </button>

          <div style="background-color: #ccc; padding: 2px;">
              <p style="text-align: center;font-size:10px;margin:0">© TuneHub</p>
          </div>
      </div>
  </div>
      `,
    };

    await sendMail(
      mailOptions.to,
      mailOptions.subject,
      mailOptions.text,
      mailOptions.html
    );

    return artist;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createArtist = async (userId, artistName) => {
  try {
    const result = await Artist.create({
      artist_name: artistName,
      userId: userId,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getArtstImage = async ({artistId}) => {
  try {
    const artist = await Artist.findOne({
      _id: artistId
    })
    const user = await User.findOne({
      _id: artist.userId
    })
    return user.profile_picture
  } catch (error) {
    throw new Error(error.message);
  }
}
 
const getAllArtistLable = async () => {
  try {
    const artists = await Artist.find().select("artist_name _id").exec();
    const formattedArtists = artists.map((artist) => ({
      label: artist.artist_name,
      value: artist._id,
    }));
    return formattedArtists;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  findArtistByName,
  findArtistByUserId,
  searchArtistByName,
  addSongUpload,
  getRisingArtist,
  hotArtist,
  makeAlbum,
  findByArtistId,
  topGenre,
  topStreamFavouritePurchase,
  topDonateUser,
  topFollower,
  getArtistFollowerByAdmin,
  createArtistByAdmin,
  findArtistByNameExact,
  createArtist,
  getAllArtistLable,
  getArtstImage
};
