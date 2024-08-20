import { useEffect, useRef, useState } from "react";
import PerformRequest from "../../utilities/PerformRequest";
import { FaPlayCircle, FaRegHeart } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSong,
  toogleIsPlaying,
} from "../../redux/player";
import {addSongToQueue} from "../../redux/songQueue.js"
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import { Link } from "react-router-dom";
import auth, { setUserInfo } from "../../redux/auth.js";
import PlayListAddMenu from "../PlayListAddMenu.js";

export default function LatestRelease() {
  const hasMounted = useRef(false);
  const songQueue = useSelector((state)=>state.songQueue.songQueue)
  const { OriginalRequest } = PerformRequest();
  const [latestTrack, setLatestTRack] = useState([]);
  const dispatch = useDispatch();
  const [songMenuAnchor, setSongMenuAnchor] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [songInAction, setSongInAction] = useState(null);

  const [subMenuIsOpen, setSubMenuIsOpen] = useState(false);
  const [playlistMenuAnchor, setPlaylistMenuAnchor] = useState(null);

  const closeMenu = (e, song) => {
    setMenuIsOpen(false);
    setSongMenuAnchor(null);
  };
  const openMenu = (e, song) => {
    setSongInAction(song);
    setMenuIsOpen(true);
    setSongMenuAnchor(e.currentTarget);
  };
  useEffect(() => {
    const fetchLatestTrack = async () => {
      try {
        const result = await OriginalRequest("songs/getLatest/?limit=12&songType=All&songName=", "GET");
        if (result.data) {
          setLatestTRack(result.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchLatestTrack();
    } else {
      hasMounted.current = true;
    }
  }, []);

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

  return (
    <div className="w-full">
      <h4 className="text-2xl font-semibold mb-2 dark:text-white ml-4 pl-12">
        Latest release
      </h4>
      <div className="flex flex-wrap px-16">
        {latestTrack.map((track) => (
          <div
            key={track._id} // Add a unique key to each element in the array
            className={`card border lg:w-2/12 md:w-4/12 sm:w-6/12 pb-2 rounded  hover:bg-light30 hover:dark:bg-dark30 hover:shadow-md hover:shadow-neutral-400 hover:dark:shadow-blue-600/40 dark:border-none ${
              menuIsOpen && songInAction._id === track._id
                ? "bg-light30 dark:bg-dark30 shadow-md shadow-neutral-400 dark:shadow-blue-600/40"
                : ""
            }`}
          >
            <div className="py-2 px-3">
              <div className="relative">
                <div
                  className={`absolute inset-0 group bg-black bg-opacity-0 hover:bg-opacity-65 ${
                    menuIsOpen && songInAction._id === track._id
                      ? "bg-opacity-65"
                      : ""
                  } rounded-md flex items-center justify-center backdrop-filter`}
                >
                  <div
                    className={`flex opacity-0 group-hover:opacity-80 ${
                      menuIsOpen && songInAction._id === track._id
                        ? "opacity-80"
                        : ""
                    } justify-around items-center w-full`}
                  >
                    <FaRegHeart
                      className="text-light10 dark:text-dark10"
                      size={20}
                    />
                    <FaPlayCircle
                      className="text-light10 dark:text-dark10"
                      size={40}
                      onClick={(e) => {
                        dispatch(setCurrentSong(track));
                        dispatch(toogleIsPlaying(true));
                      }}
                    />
                    <IoEllipsisHorizontal
                      className="text-light10 dark:text-dark10"
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        openMenu(e, track);
                      }}
                    />
                  </div>
                </div>
                <img
                  src={track.cover_image}
                  className="w-44 h-44 rounded-md mx-auto border-2 border-neutral-400/20 object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:px-3 md:px-3 sm:px-8">
              <Link
                to={`/songdetail/${track._id}`}
                className="text-lightText dark:text-darkText font-medium line-clamp-1 overflow-ellipsis hover:underline"
              >
                {track.song_name}
              </Link>
              <div className="flex">
                <Link
                  to={`/artist/${track.artist._id}`}
                  className="text-lightTextSecondary w-1/2 text-sm dark:text-darkTextSecondary line-clamp-2 overflow-ellipsis hover:underline"
                >
                  {track.artist.artist_name}
                </Link>
                <p className="text-lightTextSecondary text-right w-1/2 text-sm dark:text-darkTextSecondary line-clamp-2 overflow-ellipsis">
                  {new Date(track.createdAt).toLocaleString("en-US", {
                    timeZone: "Asia/Ho_Chi_Minh",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
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
            <ListItemText className="text-right">Add To Playlist</ListItemText>
          </ListItemIcon>
        </MenuItem>

        <Menu
          anchorEl={playlistMenuAnchor}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={subMenuIsOpen} // Mở menu con khi subMenuIsOpen === true
          onClose={() => setSubMenuIsOpen(false)} // Đóng menu con khi nhấn ra ngoài hoặc chọn một tùy chọn
        >
          <MenuItem onClick={handleCreatePlaylist}>Create a Playlist</MenuItem>
          <div style={{ overflowY: "auto", maxHeight: "200px" }}>
            <PlayListAddMenu songId={songInAction} />
          </div>
        </Menu>
      </Menu>
      <div className="flex justify-center">
        <Link
          to={`songList/${encodeURIComponent(
            "songs-getLatest"
          )}/Latest-releases/`}
          className="text-center underline text-lightText dark:text-darkText"
        >
          See more
        </Link>
      </div>
    </div>
  );
}
