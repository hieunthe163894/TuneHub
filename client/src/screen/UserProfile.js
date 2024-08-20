import React, { useEffect, useRef, useState, useCallback } from "react";
import NoSpaceHeaderTemplate from "../template/NoSpaceHeaderTemplat.js";
import SERVER_URL from "../config.js";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PerformRequest from "../utilities/PerformRequest.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/auth.js";
import "../style/userprofile.css";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import Modal from "react-modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FormControl, TextField } from "@mui/material";
import { useDropzone } from "react-dropzone";
import SongList from "../component/SongList.js";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import TransactionHistory from "../component/TransactionHistory.js";
import AlbumList from "../component/AlbumsList.js";
import { setSongQueue } from "../redux/songQueue.js";
import { setCurrentSong, toogleIsPlaying } from "../redux/player.js";
export default function UserProfile() {
  const navigate = useNavigate();
  const hasMounted = useRef(false);
  const auth = useSelector((state) => state.auth.userInfo);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { OriginalRequest } = PerformRequest();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [songMenuAnchor, setSongMenuAnchor] = useState(null);
  const [selectedButton, setSelectedButton] = useState("yourself");
  const [editProfile, setEditProfile] = useState({
    id: auth._id,
    firstName: auth.first_name,
    lastName: auth.last_name,
    introduction: auth.introduction,
    profilePicture: auth.profile_picture,
  });
  const [imageSrc, setImageSrc] = useState(auth.profile_picture);
  const [imageFile, setImageFile] = useState(null);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const updateEditProfile = { ...editProfile };
    updateEditProfile.profilePicture = imageSrc;
    try {
      const data = await OriginalRequest(
        "user/edit-profile",
        "PUT",
        updateEditProfile
      );
      console.log(data);
      if (data.data) {
        dispatch(setUserInfo(data.data));
      }
      setIsOpen0(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen0, setIsOpen0] = useState(false);
  const [changePassword, setChangePassword] = useState({
    id: auth._id,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChangePassword({
      ...changePassword,
      [name]: value,
    });
    if (name === "confirmPassword") {
      setPasswordMatch(changePassword.newPassword === value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      toast.error("The new password does not match the password validation.");
    } else {
      try {
        OriginalRequest("user/change-password", "PUT", changePassword);
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to change password:", error);
      }
    }
  };

  const openMenu = (e) => {
    setMenuIsOpen(true);
    setSongMenuAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuIsOpen(false);
    setSongMenuAnchor(null);
  };

  const handleEditProfile = () => {
    setIsOpen0(true);
    closeMenu();
  };

  const handleChangePassword = () => {
    setIsOpen(true);
    closeMenu();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const [artistFollowed, setArtistFollowed] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [purchasedSongs, setPurchasedSongs] = useState([]);
  const [favouritedSong, setFavouritedSong] = useState([]);
  const fetchArtistFollowed = async () => {
    const data = await OriginalRequest("user/artistFollowed", "GET");
    if (data) {
      setArtistFollowed(data.data);
    }
  };

  const fetchPlayList = async () => {
    const data = await OriginalRequest("user/listPlayList", "GET");
    if (data) {
      setPlayList(data.data);
    }
  };
  const fetchPurchasedSongs = async () => {
    const data = await OriginalRequest("songs/getPurchasedSongs", "GET");
    if (data) {
      setPurchasedSongs(data.data);
    }
  };
  const fetchFavouritedSongs = async () => {
    const data = await OriginalRequest("user/favouritedSong", "GET");
    if (data) {
      setFavouritedSong(data.data);
    }
  };
  useEffect(() => {
    fetchArtistFollowed();
    fetchPlayList();
    fetchPurchasedSongs();
    fetchFavouritedSongs();
  }, []);

  const handleChangeType = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <NoSpaceHeaderTemplate>
      <div className="w-full min-h-screen p-5">
        <div className="profile-contain pb-5">
          <div className="profile-header bg-light30 dark:bg-dark30 rounded-lg shadow-lg">
            <div className="profile-info">
              <div className="picture">
                <img
                  className="object-cover object-center w-40 h-40 rounded-lg ml-4"
                  src={auth.profile_picture}
                  alt="Girl in a jacket"
                />
              </div>
              <div className="info-user text-lightText dark:text-darkText">
                <h1>
                  {auth.first_name} {auth.last_name}
                </h1>
                <p id="introduce" className=" h-13 line-clamp-2 overflow-y">
                  {auth.introduction}
                </p>
                <p id="number-playlist">{playList.length} Public Playlist</p>
              </div>
              <div className="">
                <IoEllipsisHorizontal onClick={openMenu} />
              </div>
            </div>
          </div>
          <Menu
            anchorEl={songMenuAnchor}
            open={menuIsOpen}
            onClose={closeMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleEditProfile}>
              <ListItemIcon>
                <FaPen fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleChangePassword}>
              <ListItemIcon>
                <RiLockPasswordFill fontSize="small" />
              </ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </MenuItem>
          </Menu>
          <div className="profile-content">
            <Modal
              isOpen={isOpen}
              onRequestClose={() => setIsOpen(false)}
              contentLabel="Change Password"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 p-8"
            >
              <form onSubmit={handleSubmit}>
                <Box sx={style}>
                  <h2 className="text-center text-2xl font-bold mb-6">
                    Change Password
                  </h2>
                  <input
                    type="password"
                    name="currentPassword"
                    value={changePassword.currentPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:border-orange-500"
                    placeholder="Current Password"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    value={changePassword.newPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:border-orange-500"
                    placeholder="New Password"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={changePassword.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none ${
                      passwordMatch
                        ? "focus:border-orange-500"
                        : "focus:border-red-500"
                    }`}
                    placeholder="Confirm New Password"
                  />
                  {!passwordMatch && (
                    <p className="text-red-500 mb-4">
                      Mật khẩu mới không khớp.
                    </p>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full py-2"
                  >
                    Change Password
                  </Button>
                </Box>
              </form>
            </Modal>
            <Modal
              isOpen={isOpen0}
              onRequestClose={() => setIsOpen0(false)}
              contentLabel="Edit Profile"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 p-8"
            >
              <form
                style={{ paddingTop: "10px" }}
                className="w-full"
                encType="multipart/form-data"
                onSubmit={(e) => {
                  handleSubmit1(e);
                }}
              >
                <Box sx={style}>
                  <h4 className="font-medium text-lightText text-2xl pb-6 text-center">
                    Edit profile
                  </h4>
                  <img
                    src={imageSrc}
                    className="w-20 h-20 rounded-full mx-auto mb-5 object-cover object-center"
                  />
                  <FormControl className="w-full gap-2 flex-col">
                    <div className="flex items-center justify-between">
                      <TextField
                        required
                        label="First name"
                        name="firstName"
                        value={editProfile.firstName}
                        color="warning"
                        onChange={(e) => {
                          handleDataChange(e);
                        }}
                      />
                      <div className="w-5"></div>
                      <TextField
                        required
                        label="Last name"
                        name="lastName"
                        value={editProfile.lastName}
                        color="warning"
                        onChange={(e) => {
                          handleDataChange(e);
                        }}
                      />
                    </div>
                    <TextField
                      label="Introduce yourself"
                      name="introduction"
                      value={editProfile.introduction}
                      color="warning"
                      multiline
                      rows={2}
                      onChange={(e) => {
                        handleDataChange(e);
                      }}
                    />
                    <div {...getRootProps()} style={dropzoneStyle}>
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the files here ...</p>
                      ) : (
                        <p>Drop or browse your profile picture</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-light10 text-white py-2 px-4 rounded-full hover:bg-orange-500 hover:text-lightText transition duration-300 mb-2"
                    >
                      Save
                    </Button>
                    <Button
                      className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300"
                      onClick={() => setIsOpen0(false)}
                    >
                      Cancel
                    </Button>
                  </FormControl>
                </Box>
              </form>
            </Modal>
          </div>
        </div>
        <div className="flex flex-row">
          <button
            onClick={() => handleChangeType("yourself")}
            className={`px-4 py-2 m-1 ${
              selectedButton === "yourself"
                ? "border-b-2 border-orange-500"
                : ""
            }`}
          >
            <h1 className="text-xl font-semibold dark:text-darkText">
              Yourself
            </h1>
          </button>
          <button
            onClick={() => handleChangeType("recent")}
            className={`px-4 py-2 m-1 ${
              selectedButton === "recent" ? "border-b-2 border-orange-500" : ""
            }`}
          >
            <h1 className="text-xl font-semibold dark:text-darkText">Recent</h1>
          </button>
          <button
            onClick={() => handleChangeType("transaction")}
            className={`px-4 py-2 m-1 ${
              selectedButton === "transaction"
                ? "border-b-2 border-orange-500"
                : ""
            }`}
          >
            <h1 className="text-xl font-semibold dark:text-darkText">
              Transaction
            </h1>
          </button>
        </div>
        {selectedButton === "transaction" ? (
          <TransactionHistory />
        ) : selectedButton === "recent" ? (
          <>
            <div className="px-5">
              <h1 className="text-lg font-semibold dark:text-darkText mt-5">
                Top Stream Song
              </h1>
              <SongList url={`user/StreamSong`} />
            </div>
            {artistFollowed.length !== 0 && (
              <div className="mt-8">
                <div className="mx-auto">
                  <h2 className="text-lg font-semibold mb-5 dark:text-white ml-4">
                    Artist Followed
                  </h2>
                </div>
                <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary">
                  {artistFollowed.map((art, index) => (
                    <div
                      key={index}
                      className="card p-4 pr-0 ml-4 mr-5 border rounded-md bg-light60 dark:bg-dark60 relative shadow-md hover:shadow-neutral-400 hover:bg-light30 dark:hover:shadow-blue-500/50 dark:hover:bg-dark30 dark:shadow-md dark:border-none mb-8"
                    >
                      <img
                        src={art.profile_picture}
                        className="rounded-full w-40 h-40 object-cover object-center"
                      />
                      <Link
                        to={`/artist/${art._id}`}
                        className="text-xs hover:underline"
                      >
                        <h3
                          id="h3-card"
                          className="text-lg text-lightText font-semibold dark:text-white m-2 w-40 overflow-hidden line-clamp-1"
                        >
                          {art.artist_name}
                        </h3>
                      </Link>
                      {art.introduction ? (
                        <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2 w-40 h-12 overflow-hidden line-clamp-2">
                          {art.introduction}
                        </p>
                      ) : (
                        <p className="text-md text-light30 dark:text-dark30 ml-2">
                          Null
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="px-5">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold dark:text-darkText mt-5">
                  Favorite song
                </h1>
                <span
                  className="text-lg font-normal cursor-pointer hover:text-light10 dark:hover:text-dark dark:text-darkText mr-5"
                  onClick={(e) => {
                    dispatch(setSongQueue(favouritedSong));
                    dispatch(setCurrentSong(favouritedSong[0]));
                    dispatch(toogleIsPlaying(true));
                  }}
                >
                  Play all
                </span>
              </div>
              <SongList url={`user/favouritedSong`} />
            </div>
            {playList.length !== 0 && (
              <div className="mt-5 ml-5">
                <div className="mx-auto">
                  <h2 className="text-lg font-semibold mb-5 dark:text-white ml-0">
                    Playlist
                  </h2>
                </div>
                <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary">
                  {playList.map((ply, index) => (
                    <div
                      key={index}
                      className="card p-4 pr-2 ml-0 mr-8 border rounded-md bg-light60 dark:bg-dark60 relative shadow-md hover:shadow-neutral-400 hover:bg-light30 dark:hover:shadow-blue-500/50 dark:hover:bg-dark30 dark:shadow-md dark:border-none mb-8"
                    >
                      <img
                        src={ply.play_list_cover}
                        className="rounded-md w-40 h-40 object-cover object-center"
                      />
                      <Link
                        to={`/playlist/${ply._id}`}
                        className="text-xs hover:underline"
                      >
                        <h3
                          id="h3-card"
                          className="text-lg text-lightText font-semibold dark:text-white m-2 w-40 overflow-hidden line-clamp-1"
                        >
                          {ply.play_list_name}
                        </h3>
                      </Link>
                      {ply.createdAt ? (
                        <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2 w-40 h-12 overflow-hidden line-clamp-2">
                          Date created: <br />
                          {ply.createdAt}
                        </p>
                      ) : (
                        <p className="text-md text-light30 dark:text-dark30 ml-2">
                          Null
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="px-5">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold dark:text-darkText mt-5">
                  Purchased Songs
                </h1>
                <span
                  className="text-lg font-normal cursor-pointer hover:text-light10 dark:hover:text-dark dark:text-darkText mr-5"
                  onClick={(e) => {
                    dispatch(setSongQueue(purchasedSongs));
                    dispatch(setCurrentSong(purchasedSongs[0]));
                    dispatch(toogleIsPlaying(true));
                  }}
                >
                  Play all
                </span>
              </div>
              <SongList url={"songs/getPurchasedSongs"} />
            </div>
            <div className="px-5 pt-8">
              <h1 className="text-lg font-semibold dark:text-darkText mt-5">
                Purchased Albums
              </h1>
              <AlbumList url={`album/getUserPurchasedAlbum`} />
            </div>
          </>
        )}
      </div>
    </NoSpaceHeaderTemplate>
  );
}
