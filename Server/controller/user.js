import { AuthenticateRepository, SongRepository, UserRepository } from "../repository/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/RegisteredUser.js"
const changePassword = async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    console.log(req.body);
    const user = await UserRepository.findById(id);

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Lưu mật khẩu mới vào cơ sở dữ liệu
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const editProfile = async (req, res) => {
  try {
    const { id, firstName, lastName, introduction, profilePicture } = req.body;

    // Update the user profile
    const updatedUser = await UserRepository.updateProfile(id, {
      firstName,
      lastName,
      introduction,
      profilePicture,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Populate the artist_followed field with specific fields only
    const populatedUser = await User.findById(updatedUser._doc._id)
      .populate({
        path: "artist_followed",
        select: "_id artist_name",
        populate: { path: "userId", select: "profile_picture" },
      })
      .exec();

    console.log("UpdatedUser: ", populatedUser);

    // Exclude sensitive fields
    const { password, createdAt, updatedAt, ...userWithoutSensitiveData } = populatedUser._doc;

    return res.status(200).json({ message: "Edit profile successfully", data: userWithoutSensitiveData });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({ message: error.message });
  }
};


const followArtist = async (req, res) => {
  try {
    const { artistId } = req.body;
    const userId = req.decodedToken.userId;
    const registeredUser = await UserRepository.followArtist({
      artistId,
      userId,
    });
    return res.status(200).json({ data: registeredUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const checkArtistFollowed = async (req, res) => {
  try {
    const artistId = req.params.artistId;
    const token = req.cookies.accessToken;
    let userId;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const existingUser = await AuthenticateRepository.getUserById(
        decodedToken.userId
      );
      userId = decodedToken.userId;
      if (!existingUser) {
        return res.status(400).json({ error: "User was not found" });
      }
    }

    const registeredUser = await UserRepository.checkArtistFollowed({
      artistId,
      userId,
    });
    console.log(registeredUser);
    return res.status(200).json(registeredUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getListArtistFollowed = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const idArtistFollowed = await UserRepository.getListArtistFollowed(userId);
    const listArtistFollowed = await UserRepository.getInforArtistFollowed(
      idArtistFollowed.artist_followed
    );
    res.status(200).json({ data: listArtistFollowed });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getListPlayList = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const listPlayList = await UserRepository.getListPlayList(userId);
    res.status(200).json({ data: listPlayList });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getListFavouritedSong = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const listFavouritedSong = await UserRepository.getListFavouritedSong(userId);
    res.status(200).json({ data: listFavouritedSong });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getStreamSong = async (req, res) => {
  try {
    const userId = req.decodedToken.userId;
    const listStreamSong = await SongRepository.getStreamSongbyId(userId);
    res.status(200).json({ data: listStreamSong });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUser = await UserRepository.getAllUser();
    res.status(200).json({ data: allUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const banAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const banAccount = await UserRepository.banAccount(id, active);
    res.status(200).json({ data: banAccount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default {
  changePassword,
  editProfile,
  followArtist,
  checkArtistFollowed,
  getListArtistFollowed,
  getListPlayList,
  getListFavouritedSong,
  getStreamSong,
  getAllUser,
  banAccount,
};
