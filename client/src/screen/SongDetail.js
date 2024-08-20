import NoSpaceHeaderTemplate from "../template/NoSpaceHeaderTemplat";
import SongList from "../component/SongList.js";
import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import PerformRequest from "../utilities/PerformRequest.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setScrollPos } from "../redux/window";
import { RiVipDiamondFill } from "react-icons/ri";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { BsCartCheck } from "react-icons/bs";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import {
  setCurrentSong,
  toogleIsPlaying,
  addSongToQueue,
} from "../redux/player.js";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import { MdOutlineReport } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import auth, { setUserInfo } from "../redux/auth.js";
import PlayListAddMenu from "./PlayListAddMenu.js";
import { FaPlay } from "react-icons/fa";

import { MdOutlineAttachMoney } from "react-icons/md";
import CommentPopup from "../component/PopupComments.js";
import { GoDotFill } from "react-icons/go";
import SongEvent from "../component/SongEvent.js";
import ReportDialog from "../component/ReportDialog.js";
import toast from "react-hot-toast";
export default function SongDetail() {
  const { songId } = useParams();
  const [artistIds, setArtistIds] = useState([]);
  const [genres, setGenres] = useState([]);
  const [song, setSong] = useState({});
  const { OriginalRequest } = PerformRequest();
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const scrollPos = useSelector((state) => state.window.scrollPos);
  const currentSong = useSelector((state) => state.player.currentSong);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [songMenuAnchor, setSongMenuAnchor] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [songInAction, setSongInAction] = useState(null);
  const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
  const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportId, setReportId] = useState(null);

  const handleReportSubmit = async () => {
    setReportOpen(false);
  };

  const handleReportClose = () => {
    setReportOpen(false);
    setReportId(null);
  };

  const handleReportClick = (id) => {
    setReportId(id);
    setReportOpen(true);
  };

  const closeMenu = (e, song) => {
    setMenuIsOpen(false);
    setSongMenuAnchor(null);
  };
  const openMenu = (e, song) => {
    setSongInAction(song);
    setMenuIsOpen(true);
    setSongMenuAnchor(e.currentTarget);
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
  const fetchSong = async () => {
    try {
      console.log(userInfo);
      const data = await OriginalRequest(`songs/detailSong/${songId}`, "GET");
      if (data && data.data) {
        setSong(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      dispatch(setScrollPos(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchSong();
  }, [songId, onchange]);

  const formatCreatedAt = (createdAt) => {
    if (createdAt) {
      return createdAt.split("T")[0];
    }
    return "";
  };

  const handleSongChange = async (newSongId) => {
    try {
      const data = await OriginalRequest(
        `songs/detailSong/${newSongId}`,
        "GET"
      );
      if (data) {
        setSong(data.data);
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };

  return (
    <NoSpaceHeaderTemplate>
      <div className="overflow-hidden">
        {song && (
          <div className={`profileHeader w-full h-96 relative`}>
            <div
              style={{
                backgroundImage: `url('${song.cover_image}')`,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                filter: "blur(5px)",
              }}
              className="w-full h-96 bg-center bg-cover"
            ></div>
            <div className={`w-full h-full pt-56 relative`}>
              {/* <div
                className="absolute inset-0 bg-light30 dark:bg-dark30"
                style={{ opacity: `${(scrollPos * 0.7) / 180}` }}
              ></div> */}
              <div className="bg-light60 dark:bg-dark30 max-w h-44 rounded-lg m-10 shadow-lg">
                <div className="flex items-center h-full pl-5 ">
                  <div
                    style={{ backgroundImage: `url(${song.cover_image})` }}
                    className={`w-40 h-36 rounded-lg relative bg-cover bg-center flex items-center justify-center group`}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-md"></div>
                    <FaPlay
                      className="size-9 text-light10 dark:text-dark10 z-10 opacity-0 group-hover:opacity-100"
                      key={song._id}
                      onClick={(e) => {
                        dispatch(setCurrentSong(song));
                        dispatch(toogleIsPlaying(true));
                      }}
                    />
                  </div>
                  <div className="flex justify-between px-5 py-3 h-full w-full">
                    <div className="text-lightText dark:text-darkText">
                      <div className="flex flex-col justify-around h-full">
                        <div>
                          <p className="text-2xl font-medium flex items-center">
                            {song.song_name} &nbsp;
                            {song.is_exclusive ? (
                              userInfo &&
                              userInfo.songs_purchased?.includes(songId) ? (
                                <div className="bg-sky-600/70 px-2 rounded-md font-semibold text-base">
                                  OWNED
                                </div>
                              ) : (
                                <RiVipDiamondFill
                                  size={20}
                                  className="text-[#E6CA69]"
                                />
                              )
                            ) : (
                              <></>
                            )}
                          </p>
                          <div className="flex items-center text-md text-lightTextSecondary dark:text-darkTextSecondary">
                            <Link
                              className="hover:underline"
                              to={`/artist/${song.artist?._id}`}
                            >
                              {song.artist ? song.artist.artist_name : ""}{" "}
                              &nbsp;
                            </Link>
                            <GoDotFill size={10} />
                            <p>
                              &nbsp; {formatCreatedAt(song.createdAt)} &nbsp;
                            </p>
                            <GoDotFill size={10} />
                            <p className=" text-lightTextSecondary dark:text-darkTextSecondary ">
                              &nbsp;
                              {song.genre?.name}
                              &nbsp;
                            </p>
                            {song.event?._id ? (
                              <>
                                <GoDotFill size={10} /> &nbsp;
                                <span className="text-yellow-500 font-medium">
                                  On sale for {song.event.discount}%
                                </span>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <CommentPopup
                            url={`comments/getAllComments/${songId}`}
                            className="hover:cursor-pointer"
                          />
                          {song.is_exclusive ? (
                            <Link
                              to={`/payment/purchase/${song._id}`}
                              className="text-lightTextSecondary dark:text-darkTextSecondary ml-3"
                              onClick={(e) => {
                                if (
                                  userInfo &&
                                  userInfo?.songs_purchased?.includes(songId)
                                ) {
                                  e.preventDefault();
                                  toast.error("Song owned");
                                }
                              }}
                            >
                              <MdOutlineAttachMoney size={28} />
                            </Link>
                          ) : (
                            <></>
                          )}

                          <MdOutlineReport
                            className="text-lightTextSecondary dark:text-darkTextSecondary ml-3 hover:cursor-pointer"
                            size={28}
                            onClick={() => handleReportClick(song._id)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center z-10 pr-2">
                      <IoEllipsisHorizontal
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenu(e, song);
                        }}
                        size={30}
                        className="text-lightTextSecondary dark:text-darkTextSecondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-light60 dark:bg-dark60 px-5">
          {song.participated_artists_users &&
          song?.participated_artists_users.length > 0 ? (
            <div className="">
              <h4 className="text-lightText dark:text-darkText font-semibold text-xl mt-20 ml-5 mb-5">
                Participated Artist
              </h4>
              <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary w-full">
                {song.participated_artists_users.map((user, index) => (
                  <div
                    key={index}
                    className="card p-4 ml-4 mr-5 border rounded-md bg-light5 dark:bg-dark30 relative shadow-md shadow-neutral-400 dark:shadow-blue-500/50 dark:shadow-md dark:border-none mb-8"
                  >
                    <img
                      src={user.profile_picture}
                      className="rounded-full w-40 h-40 object-cover object-center"
                    />
                    <h3 className="text-lg font-semibold dark:text-white m-2">
                      <Link
                        to={`/artist/${song.participated_artists_details[index]._id}`}
                        className="text-xs hover:underline"
                        style={{
                          fontSize: "1.125rem",
                          lineHeight: "1.25rem",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {song.participated_artists_details[index].artist_name}
                      </Link>
                    </h3>
                    <h3 className="m-2">{user.introduction}</h3>
                    <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2"></p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="px-5">
            <h4
              className={`text-lightText dark:text-darkText font-semibold text-xl ${
                song?.participated_artists_users?.length === 0 ? "mt-20" : ""
              }`}
            >
              You Might Like
            </h4>
            {song.artist && song.genre && (
              <SongList
                onSongChange={handleSongChange}
                url={"songs/getRelevantSongs"}
                method={"POST"}
                body={{
                  artistIds: [song.artist?._id],
                  genres: [song.genre?._id],
                }}
              />
            )}
          </div>
          {song.event?._id ? <SongEvent event={song.event} /> : <></>}
          <div className="h-5"></div>
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
      </div>
      <ReportDialog
        open={reportOpen}
        onClose={handleReportClose}
        onSubmit={handleReportSubmit}
        reportId={reportId}
        span={"song"}
      />
    </NoSpaceHeaderTemplate>
  );
}
