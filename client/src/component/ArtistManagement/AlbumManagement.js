import React, { useEffect, useState } from "react";
import DefaultTemplate from "../../template/DefaultTemplate.js";
import PerformRequest from "../../utilities/PerformRequest.js";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaSearch, FaEdit } from "react-icons/fa";
import { BsHeartFill } from "react-icons/bs";
import { RiVipDiamondFill } from "react-icons/ri";
import { TbPlaylistOff, TbPlaylist } from "react-icons/tb";
import { setCurrentSong, toogleIsPlaying } from "../../redux/player.js";
import { Link } from "react-router-dom";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Slider,
} from "@mui/material";
import ReactPlayer from "react-player";
import Select from "@mui/material/Select";
import { CgColorPicker } from "react-icons/cg";
import { IoIosClose } from "react-icons/io";
import { HexColorPicker } from "react-colorful";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
function AlbumManagement() {
  const { OriginalRequest } = PerformRequest();
  const dispatch = useDispatch();
  const [SongList, setSong] = useState([]);
  const [date, setDate] = useState("alltime");
  const [sort, setSort] = useState("streamCount");
  const fetchSong = async (date, sort) => {
    const data = await OriginalRequest(
      `album/filterAlbumByArtist/${date}/${sort}`,
      "GET"
    );
    if (data) {
      setSong(data.data);
    }
  };

  useEffect(() => {
    fetchSong(date, sort);
  }, [date, sort]);
  const handleChange = (value, type) => {
    if (type === "sort") {
      setSort(value);
    } else if (type === "date") {
      setDate(value);
    }
  };

  const [songId, setSongId] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [status, setStatus] = useState(false);

  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);
  const [currenAlbum, setCurrenAlbum] = useState(null);
  const [albumDetail, setAlbumDetail] = useState(null);

  const fetchAlbumDetail = async () => {
    if (currenAlbum) {
      const data = await OriginalRequest(
        `album/getAlbumById/${currenAlbum}`,
        "GET"
      );
      if (data) {
        setAlbumDetail(data.data);
        setAlbumChange(data.data);
        setAlbumCover(data.data.album_cover);
      }
    }
  };

  useEffect(() => {
    fetchSongsByAlbum();
    fetchAlbumDetail();
  }, [currenAlbum]);
  const openAlbumDetail = (albumId) => {
    setCurrenAlbum(albumId);
    setModalDetailIsOpen(true);
  };
  const closeAlbumDetail = () => {
    setAlbumChange(albumDetail);
    setModalDetailIsOpen(false);
  };

  const openModal = (id, status) => {
    setSongId(id);
    setCurrentSong(id);
    setIsOpen(true);
    setStatus(!status);
  };
  const closeModal = () => {
    setCurrentSong(null);
    setIsOpen(false);
  };
  const handleConfirm = () => {
    handleDisableAlbum(songId);
    closeModal();
  };

  const updateAlbumById = async () => {
    await OriginalRequest(`album/updateAlbumById/`, "PUT", { albumChange });
  };

  const handleConfirmChange = () => {
    updateAlbumById();
    setModalDetailIsOpen(false);
  };

  const handleDisableAlbum = async (songId) => {
    try {
      await OriginalRequest(`album/disableEnableAlbum`, "POST", {
        songId,
        status,
      });
      setSong((prevSongList) =>
        prevSongList.map((song) =>
          song._id === songId ? { ...song, is_public: !song.is_public } : song
        )
      );
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const album = {
    background: "#ffffff", // example color
    songs: [
      {
        _id: 1,
        song_name: "Song 1",
        cover_image: "https://via.placeholder.com/100",
        price: 1000,
        duration: 240, // example duration
        artist: { artist_name: "Artist 1" },
      },
      // Add more songs here
    ],
  };

  const unpublishedSongs = [
    {
      _id: 1,
      song_name: "Unpublished Song 1",
      cover_image: "https://via.placeholder.com/100",
    },
    {
      _id: 2,
      song_name: "Unpublished Song 2",
      cover_image: "https://via.placeholder.com/100",
    },
    // Add more unpublished songs here
  ];

  const [songInAlbum, setSongInAlbum] = useState([]);

  const fetchSongsByAlbum = async () => {
    if (currenAlbum) {
      const data = await OriginalRequest(
        `songs/getSongByAlbumByArtist/${currenAlbum}`,
        "GET"
      );
      if (data) {
        setSongInAlbum(data.data);
      }
    }
  };

  const [albumChange, setAlbumChange] = useState({
    album_name: "",
    price: 0,
    description: "",
    album_cover: "",
    promotions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbumChange({ ...albumChange, [name]: value });
  };

  const [albumCover, setAlbumCover] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAlbumCover(reader.result);
      const base64Image = reader.result;
      setAlbumChange((prevAlbumChange) => ({
        ...prevAlbumChange,
        album_cover: base64Image,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const [songCurrent, setSongCurrent] = useState(null);
  const [isOpenSong, setIsOpenSong] = useState(false);
  const openModalSong = (id) => {
    setSongCurrent(id);
    setIsOpenSong(true);
  };

  const closeModalSong = () => {
    setSongCurrent(null);
    setIsOpenSong(false);
  };

  const handleDisableSong = async () => {
    try {
      const songId = songCurrent;
      await OriginalRequest(`songs/disableEnableSong`, "POST", { songId });
      setSongInAlbum((prevSongList) =>
        prevSongList.map((song) =>
          song._id === songId ? { ...song, is_public: !song.is_public } : song
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmSong = () => {
    handleDisableSong();
    setIsOpenSong(false);
  };

  return (
    <div className="w-full">
      <h4 className="text-base font-extralight dark:text-white mt-1 ml-3">
        Top Your Album on TuneHub
      </h4>
      <div className="flex flex-row">
        <button
          onClick={() => handleChange("1month", "date")}
          className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
            date === "1month"
              ? "border-b-2 border-light10 dark:border-dark10"
              : ""
          }`}
        >
          <span className="cursor-pointer">Last month</span>
        </button>
        <button
          onClick={() => handleChange("3month", "date")}
          className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
            date === "3month"
              ? "border-b-2 border-light10 dark:border-dark10"
              : ""
          }`}
        >
          <span className="cursor-pointer">Last 3 months</span>
        </button>
        <button
          onClick={() => handleChange("6month", "date")}
          className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
            date === "6month"
              ? "border-b-2 border-light10 dark:border-dark10"
              : ""
          }`}
        >
          <span className="cursor-pointer">Last 6 months</span>
        </button>
        <button
          onClick={() => handleChange("alltime", "date")}
          className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
            date === "alltime"
              ? "border-b-2 border-light10 dark:border-dark10"
              : ""
          }`}
        >
          <span className="cursor-pointer">All Time</span>
        </button>
        <div className="flex-grow"></div>{" "}
        <Select
          value={sort}
          onChange={(e) => handleChange(e.target.value, "sort")}
          className="font-normal w-36 h-10 text-lightText dark:text-darkText rounded-md"
        >
          <MenuItem value="streamCount">Stream Counts</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="revenue">Revenue</MenuItem>
        </Select>
      </div>
      <table className="w-full text-lightText dark:text-darkText mt-2">
        <thead className="font-semibold">
          <tr className="border-b border-neutral-300">
            <td className="pl-4 pr-6">#</td>
            <td className="w-2/12">Album name</td>
            <td className="w-1/12">Date</td>
            <td className="w-1/12">Top Song</td>
            <td className="w-2/12">Status</td>
            <td className="w-1/12 ">Price</td>
            <td className="w-1/12">Play</td>
            <td className="w-1/12">Revenue</td>
            <td className="w-1/12">Actions</td>
          </tr>
        </thead>
        <tbody className="text-lightTextSecondary dark:text-darkTextSecondary hover:po">
          {SongList.map((song, index) => (
            <tr
              className="border-b border-neutral-300  hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
              key={song._id}
            >
              <td className="pl-4 pr-6">{index + 1}</td>
              <td className="w-3/12 py-1">
                <div className="flex items-center">
                  <div
                    style={{ backgroundImage: `url('${song.album_cover}')` }}
                    className={`relative w-12 h-12 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm`}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-md"></div>

                    <FaPlay className="text-light10 dark:text-dark10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  </div>

                  <div className="ml-2">
                    <h4 className="font-semibold text-md flex flex-row">
                      {song.album_name}
                    </h4>
                    <h6 className="text-xs">
                      {song.artist ? (
                        <Link
                          to={`/artist/${song.artist._id}`}
                          className="text-xs hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {/* {song.artist.artist_name} */}
                        </Link>
                      ) : (
                        <></>
                      )}
                      {/* {song.participated_artists &&
                        song.participated_artists.length > 0 && (
                          <>
                            {song.participated_artists.map((artist, index) => (
                              <span key={index}>{index >= 0 && ", "}</span>
                            ))}
                          </>
                        )} */}
                    </h6>
                  </div>
                </div>
              </td>
              <td className="w-1/12">
                {new Date(song.createdAt).toISOString().slice(0, 10)}
              </td>

              <td className="w-2/12 hover:underline pr-6">
                {song.highStreamSong.song_name}
              </td>
              <td className="w-1/12">
                <button
                  className={`px-2 py-1 rounded ${
                    song.is_public ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {song.is_public ? "Enable" : "Disable"}
                </button>
              </td>
              <td className="w-1/12">{song.price}</td>
              <td className="w-1/12">{song.totalStreams}</td>
              <td className="w-1/12">
                {Intl.NumberFormat("de-DE").format(song.totalRevenue)}
              </td>
              <td className="w-1/12">
                <FaEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    openAlbumDetail(song._id);
                  }}
                  className="inline-block"
                />{" "}
                {song?.is_public ? (
                  <TbPlaylistOff
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(song._id, song.is_public);
                    }}
                    className="inline-block"
                  />
                ) : (
                  <TbPlaylist
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(song._id, song.is_public);
                    }}
                    className="inline-block"
                  />
                )}{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={modalIsOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 20,
            p: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
            Confirm Action
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to{" "}
            {currentSong?.is_public ? "Disable" : "Enable"} this Album?
            <hr />
            We will {currentSong?.is_public ? "Disable" : "Enable"} all Song in
            Album
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={closeModal}
              className="bg-slate-500"
              sx={{
                mr: 2,
                px: 3,
                bgcolor: "gray",
                color: "white",
                "&:hover": { bgcolor: "darkgray" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="bg-orange-400"
              sx={{
                backgroundColor: "orange",
                "&:hover": { backgroundColor: "darkorange" },
              }}
              color="primary"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={modalDetailIsOpen}
        onClose={closeAlbumDetail}
        aria-labelledby="album-detail-title"
        aria-describedby="album-detail-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "68%",
            height: "76%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
            // overflow: "auto", // Thêm overflow auto để nội dung không bị tràn
            // outline: "none",
            // borderRadius: "8px", // Thêm border radius để góc bo tròn
          }}
        >
          <Typography
            id="album-detail-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold", ml: 4, mb: 1 }}
          >
            Album Detail
          </Typography>
          <div>
            <div className="w-full flex justify-between">
              <div className="w-6/12 h-10 p-5">
                <form className="w-full">
                  <div className="flex w-full justify-between mb-2">
                    <TextField
                      label="Album Name"
                      variant="outlined"
                      className="w-1/2"
                      name="album_name"
                      value={albumChange?.album_name}
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="Price"
                      variant="outlined"
                      type="number"
                      className="w-60"
                      name="price"
                      value={albumChange?.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={2}
                    className="mb-4 mt-2"
                    value={albumChange?.description}
                    onChange={handleInputChange}
                  />
                  <div className="w-full p-1 flex justify-center items-center">
                    <div
                      className="min-w-36 h-36 py-2 mx-auto z-10 relative"
                      style={{ backgroundColor: album.background }}
                    >
                      <img
                        className="w-32 h-32 object-cover object-center mx-auto"
                        src={
                          albumCover
                            ? albumCover
                            : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                        }
                        onClick={handleImageClick}
                      />
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </div>
                    <img
                      src="https://res.cloudinary.com/djzdhtdpj/image/upload/v1709269357/png-transparent-phonograph-record-lp-record-music-others-miscellaneous-album-disc-jockey-thumbnail_1_dd0lc3.png"
                      className="w-32 h-32 right-28 relative animate-spin"
                      style={{ animationDuration: "10000ms" }}
                    />
                  </div>
                  <div></div>
                  <div className="mt-2">
                    <label className="text-lightText dark:text-darkText font-semibold text-base">
                      Promotions
                    </label>
                    <FormControl fullWidth className="mt-3">
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={unpublishedSongs}
                        getOptionLabel={(option) => option.song_name}
                        filterSelectedOptions
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            key={option._id}
                            className={`flex items-center justify-start px-3 hover:bg-neutral-200 mb-1`}
                          >
                            <img
                              className="h-10 w-10 rounded-md object-cover object-center"
                              src={option.cover_image}
                              alt={option.song_name}
                            />
                            <p className="ml-2">{option.song_name}</p>
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Promotions" />
                        )}
                      />
                    </FormControl>
                  </div>
                </form>
              </div>
              <div className="w-6/12">
                <div className="w-full">
                  <Typography
                    variant="h6"
                    component="h4"
                    className="font-semibold mb-2"
                  >
                    Songs Included
                  </Typography>
                  <table className="w-full text-lightText dark:text-darkText">
                    <thead className="font-semibold">
                      <tr className="border-b border-neutral-300">
                        <td className="w-1/12 text-center">#</td>
                        <td className="w-8/12">Song</td>
                        <td className="w-2/12">Price(vnd)</td>
                        <td className="w-1/12">Duration</td>
                        <td className="pl-2 w-1/12">Action</td>
                      </tr>
                    </thead>
                    <tbody className="text-lightTextSecondary dark:text-darkTextSecondary hover:po">
                      {songInAlbum?.map((song, index) => (
                        <tr
                          className="border-b border-neutral-300 hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
                          key={song._id}
                        >
                          <td className="w-1/12 text-center">{index + 1}</td>
                          <td className="w-8/12 py-1">
                            <div className="flex items-center">
                              <div
                                style={{
                                  backgroundImage: `url('${song.cover_image}')`,
                                }}
                                className={`relative w-12 h-12 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm`}
                              ></div>
                              <div className="ml-2">
                                <Typography
                                  variant="subtitle1"
                                  className="font-semibold"
                                >
                                  {song.song_name}
                                </Typography>
                                <Typography variant="body2">
                                  {song.artist.artist_name}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="w-1/12">
                            {Intl.NumberFormat("de-DE").format(song.price)}
                          </td>
                          <td className="w-1/12">
                            {Math.floor(song.duration / 60)}:
                            {song.duration % 60}
                          </td>
                          <td className="w-1/12">
                            {song?.is_public ? (
                              <TbPlaylistOff
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModalSong(song._id);
                                }}
                                className="inline-block"
                              />
                            ) : (
                              <TbPlaylist
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModalSong(song._id);
                                }}
                                className="inline-block"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-orange-400"
                onClick={handleConfirmChange}
                sx={{
                  px: 3,
                  bgcolor: "orange",
                  color: "white",
                  mr: 2,
                  "&:hover": { bgcolor: "darkorange" },
                }}
              >
                Confirm
              </Button>
              <Button
                className="bg-slate-500"
                onClick={closeAlbumDetail}
                sx={{
                  px: 3,
                  bgcolor: "gray",
                  color: "white",
                  "&:hover": { bgcolor: "darkgray" },
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal open={isOpenSong} onClose={closeModalSong}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 20,
            p: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
            Confirm Action
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to{" "}
            {songCurrent?.is_public ? "Disable" : "Enable"} this song?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={closeModalSong} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              className="bg-orange-400"
              sx={{
                backgroundColor: "orange",
                "&:hover": { backgroundColor: "darkorange" },
              }}
              color="primary"
              onClick={handleConfirmSong}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default AlbumManagement;
