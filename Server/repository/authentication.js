import User from "../model/RegisteredUser.js";
import Playlist from "../model/Playlist.js";
import Album from "../model/Album.js";
import Artist from "../model/Artist.js";
import Comment from "../model/Comment.js";
import Genre from "../model/Genre.js";
import Notification from "../model/Notification.js";
import PromotionPost from "../model/PromotionPost.js";
import Report from "../model/Report.js";
import Song from "../model/Song.js";
import SongStream from "../model/SongStream.js";
const authenticate = async () => {
  try {
    return { data: "hahaha" };
  } catch (error) {
    throw new Error(error.toString());
  }
};
const addUser = async ({
  firstName,
  lastName,
  email,
  hashedPassword,
  introduction,
  profilePicture,
}) => {
  try {
    const existingUser = await User.findOne({ email: email }).exec();
    // console.log(existingUser);
    if (existingUser) {
      throw new Error("The email has already been registered !!");
    }
    const result = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      introduction: introduction,
      profile_picture: profilePicture,
    });
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyUser = async (userId) => {
  try {
    const unverifiedUser = await User.findById(userId).exec();
    if (!unverifiedUser) {
      throw new Error("Not found!!");
    }
    if (unverifiedUser.verify) {
      throw new Error("The user has already been verified!!");
    }
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { verify: true } },
      { new: true }
    );
    if (!result) {
      throw new Error("Something went wrong:(");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserById = async (userId) => {
  try {
    const existingUser = await User.findById(userId)
    .populate({
      path: "artist_followed",
      select: "_id artist_name ",
      populate: { path: "userId", select: "profile_picture" },
    })
      .exec();
    if (!existingUser) {
      throw new Error("Not found!!");
    }
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserByEmail = async (email) => {
  try {
    const existingUser = await User.findOne({ email: email })
      .populate({
        path: "artist_followed",
        select: "_id artist_name ",
        populate: { path: "userId", select: "profile_picture" },
      })
      .exec();
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findByEmail = async (email) => {
  return await User.findOne({ email: email }).exec();
};

const generateResetToken = async (userId, role) => {
  return jwt.sign({ userId, role }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
};
export default {
  authenticate,
  addUser,
  verifyUser,
  getUserById,
  getUserByEmail,
  findByEmail,
  generateResetToken
};
