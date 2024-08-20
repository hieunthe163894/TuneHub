import React, { useEffect, useState } from "react";
import DefaultTemplate from "../template/DefaultTemplate";
import PerformRequest from "../utilities/PerformRequest.js";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaSearch } from "react-icons/fa";
import "../style/leaderboard.css";
import {
  setCurrentSong,
  toogleIsPlaying,
} from "../redux/player.js";
import {
    addSongToQueue
} from "../redux/songQueue.js"
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import Select from "@mui/material/Select";
import { RiVipDiamondFill } from "react-icons/ri";
import PlayListAddMenu from "./PlayListAddMenu.js";
import auth, { setUserInfo } from "../redux/auth.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function LeaderBoard() {
  const { OriginalRequest } = PerformRequest();
  const [SongList, setSong] = useState([]);
  const [ArtistList, setArtist] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songMenuAnchor, setSongMenuAnchor] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [songInAction, setSongInAction] = useState(null);
  const dispatch = useDispatch();
  const [showAllSongs, setShowAllSongs] = useState(false);
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [date, setDate] = useState("1");
  const [check, setCheck] = useState("all");
  const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);
  const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const songQueue = useSelector((state)=>state.songQueue.songQueue)
  let intervalId;
  const handleFavouriteClick = async (songId) => {
    try {
      const response = await OriginalRequest(
        `songs/favourited/${songId}`,
        "POST"
      );
      if (response) {
        const updatedSongList = [...SongList];
        updatedSongList.map((song, index) => {
          if (song._id === response.result._id) {
            song.favouritedByUser = response.favourited;
          }
        });
        setSong(updatedSongList);
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };
  useEffect(() => {
    console.log("rerender");
  }, [SongList]);
  const closeMenu = (e, song) => {
    setMenuIsOpen(false);
    setSongMenuAnchor(null);
  };
  const openMenu = (e, song) => {
    setSongInAction(song);
    setMenuIsOpen(true);
    setSongMenuAnchor(e.currentTarget);
  };

  const handleChange = (value, type) => {
    if (type === "date") {
      setDate(value);
    } else if (type === "check") {
      setCheck(value);
    }
  };

  const fetchSong = async (date, check) => {
    const data = await OriginalRequest(
      `songs/leaderboard/topSong/${date}/${check}`,
      "GET"
    );
    console.log(date);
    if (data) {
      setSong(data.data);
      setLoading(false);
    }
  };
  const fetchArtist = async () => {
    const data = await OriginalRequest("artists/leaderboard/topArtist", "GET");
    if (data) {
      setArtist(data.data);
    }
  };
  const fetchAlbum = async (date) => {
    const data = await OriginalRequest(`album/getHotAlbum`, "GET");
    console.log(date);
    if (data) {
      setAlbums(data.data);
    }
  };
  const getDateText = () => {
    switch (date) {
      case "1":
        return "Day";
      case "7":
        return "Week";
      case "30":
        return "Month";
      default:
        return "Time";
    }
  };
  const openMenuPlaylist = (e, song) => {
    setSubMenuIsOpen(true);
    setPlaylistMenuAnchor(e.currentTarget);
  };
  const closeMenuPlaylist = (e, song) => {
    setSubMenuIsOpen(false);
    setPlaylistMenuAnchor(null);
  };

  const handleCreatePlaylist = async () => {
    const response = await OriginalRequest(`playlist/create`, "POST", {
      songs: songInAction,
    });
    if (response) {
      const user = await OriginalRequest("auth/user", "GET");
      dispatch(setUserInfo(user.data));
      closeMenuPlaylist();
    }

    closeMenu();
  };

  useEffect(() => {
    fetchSong(date, check);
    fetchArtist();
    fetchAlbum();
    return () => clearInterval(intervalId);
  }, [date, check]);

  return (
    <DefaultTemplate>
      <div className="w-full min-h-screen items-center justify-center px-10">
        <h1 className="text-4xl font-bold mb-8 dark:text-white ml-4">
          LeaderBoard
        </h1>
        <div class="flex flex-row">
          <button
            onClick={() => handleChange("1", "date")}
            className={`px-4 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
              date === "1" ? "border-b-2 border-light10 dark:border-dark10" : ""
            }`}
          >
            <span className="cursor-pointer">Day</span>
          </button>
          <button
            onClick={() => handleChange("7", "date")}
            className={`px-4 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
              date === "7" ? "border-b-2 border-light10 dark:border-dark10" : ""
            }`}
          >
            <span className="cursor-pointer">Week</span>
          </button>
          <button
            onClick={() => handleChange("30", "date")}
            className={`px-4 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
              date === "30"
                ? "border-b-2 border-light10 dark:border-dark10"
                : ""
            }`}
          >
            <span className="cursor-pointer">Month</span>
          </button>
          <Select
            value={check}
            onChange={(e) => handleChange(e.target.value, "check")}
            className="font-normal w-32 text-lightText dark:text-darkText rounded-lg"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="true">Exclusive</MenuItem>
            <MenuItem value="false">Free</MenuItem>
          </Select>
        </div>
        <h2 className="text-2xl font-semibold mb-8 dark:text-white m-4">
          Top Song in {getDateText()}
        </h2>
        <table className="w-full text-lightText dark:text-darkText">
          <thead className="font-semibold">
            <tr className="border-b border-neutral-300">
              <td className="w-1/12 text-center">#</td>
              <td className="w-4/12">Song</td>
              <td className="w-2/12">Album</td>
              <td className="w-1/12 ">Play</td>
              <td className="w-1/12">Time</td>
              <td className="w-2/12 text-center">Action</td>
            </tr>
          </thead>
          <tbody className="text-lightTextSecondary dark:text-darkTextSecondary hover:po">
            {loading ? (
              <tr className="w-full">
                <td colSpan="5" className="w-full">
                  <AiOutlineLoading3Quarters
                    className={`mx-auto mt-10 text-light10 animate-spin duration-${10000}`}
                    size={35}
                  />
                </td>
              </tr>
            ) : (
              SongList.map((song, index) => (
                <tr
                  className="border-b border-neutral-300  hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
                  key={song._id}
                  onClick={(e) => {
                    dispatch(setCurrentSong(song));
                    dispatch(toogleIsPlaying(true));
                  }}
                >
                  <td className="w-1/12 text-center">{index + 1}</td>
                  <td className="w-4/12 py-2">
                    <div className="flex items-center">
                      <div
                        style={{
                          backgroundImage: `url('${song.cover_image}')`,
                        }}
                        className={`relative w-14 h-14 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm`}
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
                              onClick={(e) => {
                                dispatch(setCurrentSong(song));
                                dispatch(toogleIsPlaying(true));
                              }}
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
                          {song.participated_artists &&
                            song.participated_artists.length > 0 && (
                              <>
                                {song.participated_artists.map(
                                  (artist, index) => (
                                    <span key={index}>
                                      {index >= 0 && ", "}
                                      <Link
                                        to={`/artist/${artist._id}`}
                                        className="text-xs hover:underline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        {artist.artist_name}
                                      </Link>
                                    </span>
                                  )
                                )}
                              </>
                            )}
                        </h6>
                      </div>
                    </div>
                  </td>
                  <td className="w-4/12 hover:underline">
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
                  <td className="w-1/12">{song.streamCount}</td>
                  <td className="w-1/12">
                    {Math.floor(song.duration / 60)}:{song.duration % 60}
                  </td>

                  <td className="w-1/12 ">
                    <div className="flex items-center justify-evenly">
                      <div id={song._id}>
                        {!song.favouritedByUser ? (
                          <FaRegHeart
                            className="text-light10 dark:text-dark10 mt-1"
                            size={18}
                            onClick={(e) => {
                              handleFavouriteClick(song._id);
                              e.stopPropagation();
                            }}
                          />
                        ) : (
                          <BsHeartFill
                            className="text-light10 dark:text-dark10 mt-1"
                            size={18}
                            onClick={(e) => {
                              handleFavouriteClick(song._id);
                              e.stopPropagation();
                            }}
                          />
                        )}
                      </div>
                      <IoEllipsisHorizontal
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenu(e, song);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              )).slice(0, showAllSongs ? SongList.length : 5)
            )}
          </tbody>
        </table>
        <div className="text-center mt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAllSongs(!showAllSongs);
            }}
            className="  rounded-full px-4 py-2 text-lightText dark:text-darkText hover:underline"
          >
            {showAllSongs ? "Hide" : "See more"}
          </a>
        </div>
        <Menu
          open={menuIsOpen}
          anchorEl={songMenuAnchor}
          onClose={closeMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          autoFocus={false}
        >
          <MenuItem
            className="flex items-center"
            onClick={(e) => {
              console.log(songInAction);
              dispatch(addSongToQueue(songInAction));
              if (songQueue.length === 0) {
                dispatch(toogleIsPlaying(true));
                dispatch(setCurrentSong(songInAction));
              }
              closeMenu(e);
            }}
          >
            <ListItemIcon>
              <MdOutlineQueueMusic
                size={22}
                className="text-light10 dark:text-dark10 mr-3"
              />
              <ListItemText className="text-right">Queue Song</ListItemText>
            </ListItemIcon>
          </MenuItem>
          <MenuItem
            className="flex items-center"
            onClick={(e) => {
              openMenuPlaylist(e);
            }}
          >
            <ListItemIcon>
              <MdLibraryMusic
                size={20}
                className="text-light10 dark:text-dark10 mr-3"
              />
              <ListItemText className="text-right">
                Add To Playlist
              </ListItemText>
            </ListItemIcon>
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={playlistMenuAnchor}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={subMenuIsOpen}
          onClose={() => setSubMenuIsOpen(false)}
        >
          <MenuItem className="cursor-pointer" onClick={handleCreatePlaylist}>
            Create a Playlist
          </MenuItem>
          <div style={{ overflowY: "auto", maxHeight: "200px" }}>
            <PlayListAddMenu songId={songInAction} />
          </div>
        </Menu>
        <div className="w-full pt-8 ">
          <div className="mx-auto">
            <h2 className="text-2xl font-semibold mb-8 dark:text-white ml-4">
              Artist
            </h2>
          </div>
          <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary ml-8 w-full ">
            {ArtistList.slice(0, showAllArtists ? ArtistList.length : 5).map(
              (artist, index) => (
                <div
                  key={artist._id}
                  className="card p-4 ml-4 mr-5 border rounded-md bg-light30 dark:bg-dark30 relative shadow-md shadow-neutral-400 dark:shadow-blue-500/50 dark:shadow-md dark:border-none mb-8"
                >
                  <img
                    src={artist.artist_file.profile_picture}
                    className="rounded-full w-40 h-40 object-cover object-center"
                  />
                  <h3 className="text-lg font-semibold dark:text-white m-2">
                    {artist && (
                      <>
                        <Link
                          to={`/artist/${artist._id}`}
                          className="text-xs hover:underline"
                          style={{
                            fontSize: "1.125rem",
                            lineHeight: "1.25rem",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {artist.artist_name}
                        </Link>
                      </>
                    )}
                  </h3>

                  {artist.artist_file.introduction ? (
                    <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary w-40 h-12 overflow-hidden ml-2">
                      {artist.artist_file.introduction}
                    </p>
                  ) : (
                    <p className="text-md text-light30 dark:text-dark30 ml-2">
                      Null
                    </p>
                  )}

                  <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2">
                    Follow: {artist.followers_count}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAllArtists(!showAllArtists);
            }}
            className=" rounded-full px-4 py-2 text-lightText dark:text-darkText hover:underline"
          >
            {showAllArtists ? "Hide" : "See more"}
          </a>
        </div>
        <div className="w-full pt-8">
          <div className="mx-auto">
            <h2 className="text-2xl font-semibold mb-8 dark:text-white ml-4">
              Album
            </h2>
          </div>
          <div className="mt-5 ml-12">
            {albums.length > 0 ? (
              <div className="w-full flex flex-wrap">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="card border lg:w-2/12 md:w-4/12 sm:w-6/12 pb-2 rounded hover:bg-light30 hover:dark:bg-dark30 hover:shadow-md hover:shadow-neutral-400 hover:dark:shadow-blue-600/40 dark:border-none"
                  >
                    <div className="p-2">
                      <img
                        src={album.album_cover}
                        className="w-44 h-44 rounded-md mx-auto border-2 border-neutral-400/20 object-cover object-center"
                      />
                    </div>
                    <div className="lg:px-3 md:px-3 sm:px-8">
                      <p className="text-lightText dark:text-darkText font-medium line-clamp-1 overflow-ellipsis hover:underline">
                        {album.album_name ? (
                          <Link
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            to={"/album/" + album._id + "/" + album.artist}
                          >
                            {album.album_name}
                          </Link>
                        ) : (
                          ""
                        )}
                      </p>
                      <p className="text-lightTextSecondary text-sm dark:text-darkTextSecondary line-clamp-2 overflow-ellipsis">
                        {album.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </DefaultTemplate>
  );
}
