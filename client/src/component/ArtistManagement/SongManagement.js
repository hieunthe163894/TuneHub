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
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
function SongManagement() {
  const { OriginalRequest } = PerformRequest();
  const dispatch = useDispatch();
  const [SongList, setSong] = useState([]);
  const [date, setDate] = useState("alltime");
  const [sort, setSort] = useState("streamCount");
  const [events, setEvents] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await OriginalRequest(
        "songs/updateSong",
        "PATCH",
        songChange
      );
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSong = async (date, sort) => {
    const data = await OriginalRequest(
      `songs/filterSongByArtist/${date}/${sort}/`,
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
  const [songDetail, setSongDetail] = useState(null);
  const openModal = (id) => {
    setSongId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    handleFavouriteClick(songId);
    closeModal();
  };

  const handleFavouriteClick = async (songId) => {
    try {
      const response = await OriginalRequest(
        `songs/getSongById/${songId}`,
        "GET"
      );
      console.log(response.data.active);
      await OriginalRequest(`songs/disableEnableSong`, "POST", { songId });
      if (response.data.active) {
        setSong((prevSongList) =>
          prevSongList.map((song) =>
            song._id === songId ? { ...song, is_public: !song.is_public } : song
          )
        );
      }
      setSongId("");
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const [modalDetailIsOpen, setModalDetailIsOpen] = useState(false);

  const openSongDetail = (id) => {
    setModalDetailIsOpen(true);
    fetchSongDetail(id);
    fetchEvents();
  };
  const closeSongDetail = () => {
    setModalDetailIsOpen(false);
  };

  const [artist, setArtist] = useState([]);
  const [genres, setGenres] = useState([]);

  const fetchGenres = async () => {
    try {
      const response = await OriginalRequest("genres/", "GET");
      setGenres(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchEvents = async () => {
    try {
      const result = await OriginalRequest("event", "GET");
      if (result.data) {
        setEvents(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchArtists = async () => {
    try {
      const response = await OriginalRequest("artists/findByName", "POST", {
        artistName: "",
      });
      setArtist(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSongDetail = async (id) => {
    try {
      const response = await OriginalRequest(`songs/getSongById/${id}`, "GET");
      setSongDetail(response.data);
      setSongChange(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGenres();
    fetchArtists();
  }, []);

  const [songChange, setSongChange] = useState({
    _id: "",
    song_name: "",
    genre: {
      _id: "",
      name: "",
    },
    participated_artist: [],
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedSong = { ...songChange, [name]: value };
    console.log(updatedSong);
    setSongChange(updatedSong);
  };

  const handleArtistChange = (event, value) => {
    console.log(songChange.participated_artist);
    const updatedSongChange = {
      ...songChange,
      participated_artist: value,
    };
    console.log(updatedSongChange.participated_artist);
    setSongChange((prevSongChange) => ({
      ...prevSongChange,
      participated_artist: value,
    }));
  };
  useEffect(() => {
    console.log(songChange);
  }, [songChange]);
  return (
    <div className="w-full">
      <h4 className="text-base font-extralight dark:text-white mt-1 ml-3">
        Top Your Song on TuneHub
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
          className="font-normal w-36 h-10 text-lightText dark:text-darkText rounded-md bg-slate-100 dark:bg-slate-600"
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
            <td className="w-2/12">Song</td>
            <td className="w-1/12 pl-3">Date</td>
            <td className="w-2/12 pl-3">Album</td>
            <td className="w-2/12 pr-3">Feature</td>
            <td className="w-1/12 ">Status</td>
            <td className="w-1/12">Play</td>
            <td className="w-1/12">Revenue</td>
            <td className="w-1/12">Actions</td>
          </tr>
        </thead>
        <tbody className="text-lightTextSecondary dark:text-darkTextSecondary hover:po">
          {SongList.map((song, index) => (
            <tr
              className={`border-b border-neutral-300  hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group ${
                song.active ? "" : "bg-orange-400 text-white hover:bg-orange-500 dark:bg-blue-950 dark:hover:bg-blue-900"
              }`}
              key={song._id}
              // onClick={(e) => {
              //   dispatch(setCurrentSong(song));
              //   dispatch(toogleIsPlaying(true));
              // }}
            >
              <td className="pl-4 pr-6">{index + 1}</td>
              <td className="w-3/12 py-1">
                <div className="flex items-center">
                  <div
                    style={{ backgroundImage: `url('${song.cover_image}')` }}
                    className={`relative w-12 h-12 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm`}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-md"></div>

                    <FaPlay className="text-light10 dark:text-dark10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  </div>

                  <div className="ml-2">
                    <h4 className="font-semibold text-md flex flex-row">
                      {song.song_name ? (
                        <Link
                          to={`/songdetail/${song._id}`}
                          className="text-xs hover:underline flex items-center"
                          style={{ fontSize: "1rem", lineHeight: "1rem" }}
                        >
                          {song.song_name}
                          {song.is_exclusive ? (
                            <RiVipDiamondFill className="text-yellow-500/50 ml-1" />
                          ) : null}
                        </Link>
                      ) : (
                        <></>
                      )}
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
                          {song.artist.artist_name}
                        </Link>
                      ) : (
                        <></>
                      )}
                    </h6>
                  </div>
                </div>
              </td>
              <td className="w-1/12 pl-3">
                {new Date(song.createdAt).toISOString().slice(0, 10)}
              </td>
              <td className="w-2/12 hover:underline pr-6 pl-3">
                {song.album ? (
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    to={"/album/" + song.album._id + "/" + song.artist._id}
                  >
                    {song.album.album_name}
                  </Link>
                ) : (
                  ""
                )}
              </td>
              <td className="w-2/12 pr-3">
                {song.participated_artist &&
                  song.participated_artist.length > 0 && (
                    <>
                      {song.participated_artist.map((artist, index) => (
                        <span key={index}>
                          {artist.artist_name}
                          {index >= 0 &&
                          index != song.participated_artist.length - 1
                            ? ", "
                            : ""}
                        </span>
                      ))}
                    </>
                  )}
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
              <td className="w-1/12">{song.streamCount}</td>
              <td className="w-1/12">
                {Intl.NumberFormat("de-DE").format(song.totalRevenue)}
              </td>
              <td className="w-1/12">
                <FaEdit
                  onClick={(e) => {
                    e.stopPropagation();
                    openSongDetail(song._id);
                  }}
                  className="inline-block"
                />{" "}
                {song?.is_public ? (
                  <TbPlaylistOff
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(song._id);
                    }}
                    className="inline-block"
                  />
                ) : (
                  <TbPlaylist
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(song._id);
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
            {songDetail?.is_public ? "Disable" : "Enable"} this song?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={closeModal} sx={{ mr: 2 }}>
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
        onClose={closeSongDetail}
        aria-labelledby="album-detail-title"
        aria-describedby="album-detail-description"
      >
        {songDetail ? (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "68%",
              bgcolor: "background.paper",
              boxShadow: 24,
              outline: "none",
            }}
          >
            <Typography
              id="album-detail-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold", ml: 7, mt: 4, mb: 4 }}
            >
              Song Detail
            </Typography>
            <div>
              <div className="flex items-start justify-between mt-1">
                <div className="formSection w-10/12">
                  <form
                    className="w-10/12 mx-auto"
                    encType="multipart/form-data"
                  >
                    <FormControl className="w-full gap-6 flex-col">
                      <FormControl className="flex-row justify-between items-center">
                        <FormControl className="w-6/12 mr-1">
                          <TextField
                            required
                            label="Song Name"
                            name="song_name"
                            color="warning"
                            value={songChange?.song_name}
                            onChange={handleInputChange}
                          />
                        </FormControl>
                        <FormControl className="w-6/12 ml-1">
                          <InputLabel id="genreLabel">Genre</InputLabel>
                          <Select
                            labelId="genreLabel"
                            name="genre"
                            id="genre"
                            label="Genre"
                            value={songChange?.genre}
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                          >
                            {genres.map((genre) => (
                              <MenuItem value={genre._id} key={genre._id}>
                                {genre.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </FormControl>
                      <FormControl fullWidth>
                        <Autocomplete
                          multiple
                          id="tags-outlined"
                          options={artist}
                          getOptionLabel={(option) => option?.artist_name}
                          filterSelectedOptions
                          value={songChange?.participated_artist || []}
                          onChange={handleArtistChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Featured Artist"
                              placeholder="Featured Artist"
                            />
                          )}
                        />
                      </FormControl>
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            <FormControl className="w-3/12 mr-7">
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Public"
                                checked={songChange.is_public}
                              />
                            </FormControl>

                            <FormControl className="w-2/12">
                              <FormControlLabel
                                control={<Checkbox />}
                                label="Exclusive"
                                checked={songChange.is_exclusive}
                              />
                            </FormControl>
                          </div>

                          {songChange.is_exclusive ? (
                            <FormControl>
                              <TextField
                                label="Price(vnd)"
                                name="price"
                                type="number"
                                color="warning"
                                value={songChange.price}
                                onChange={handleInputChange}
                              />
                            </FormControl>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      {songChange.is_exclusive ? (
                        <FormControl fullWidth>
                          <InputLabel>Event</InputLabel>
                          <Select
                            name="event"
                            label="Event"
                            value={songChange.event}
                            onChange={(e) => {
                              handleInputChange(e);
                            }}
                          >
                            {events.map((event) => (
                              <MenuItem value={event._id} key={event._id}>
                                {event.eventName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <></>
                      )}
                    </FormControl>
                    <button
                      type="submit"
                      className="bg-light10 px-7 py-1 rounded-sm mt-5 text-darkText"
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
                <div className="previewSection w-6/12 px-10">
                  <img
                    className="w-full aspect-square border-2 shadow-lg border-lightTextSecondary/30 rounded-md object-cover object-center"
                    src={songDetail.cover_image}
                  />
                </div>
              </div>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  onClick={handleConfirm}
                  sx={{
                    px: 4,
                    py: 1,
                    bgcolor: "orange",
                    color: "white",
                    mr: 2,
                    "&:hover": { bgcolor: "darkorange" },
                  }}
                >
                  Confirm
                </Button>
                <Button
                  onClick={closeSongDetail}
                  sx={{
                    px: 4,
                    py: 1,
                    bgcolor: "gray",
                    color: "white",
                    "&:hover": { bgcolor: "darkgray" },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </div>
          </Box>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
}

export default SongManagement;
