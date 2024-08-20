import { useEffect, useRef, useState } from "react";
import PerformRequest from "../utilities/PerformRequest";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import { setCurrentSong, toogleIsPlaying } from "../redux/player.js";
import { addSongToQueue } from "../redux/songQueue.js";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
export default function SongListWithStreamCount({ url }) {
  const [SongList, setSongList] = useState([]);
  const { OriginalRequest } = PerformRequest();
  const dispatch = useDispatch();
  const hasMounted = useRef(false);
  const [songMenuAnchor, setSongMenuAnchor] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [songInAction, setSongInAction] = useState(null);
  const [loading, setLoading] = useState(false);
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
    const fetch = async () => {
      if (hasMounted.current) {
        try {
          setLoading(true);
          const data = await OriginalRequest(url ? url : "songs/getAll", "GET");
          if (data) {
            setSongList(data.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        hasMounted.current = true;
      }
    };
    fetch();
  }, [hasMounted, url]);
  return (
    <div className="w-full flex items-center mt-5">
      <table className="w-full text-lightText dark:text-darkText">
        <thead className="font-semibold">
          <tr className="border-b border-neutral-300">
            <td className="w-1/12 text-center">#</td>
            <td className="w-4/12">Song</td>
            <td className="hidden md:table-cell md:w-4/12 text-center">
              Album
            </td>
            <td className="w-1/12 text-center">duration</td>
            <td className="w-1/12 text-center">Stream</td>
            <td className="w-1/12"></td>
          </tr>
        </thead>
        <tbody className="text-lightTextSecondary dark:text-darkTextSecondary">
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
                className="border-b border-neutral-300 hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
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
                      style={{ backgroundImage: `url('${song.cover_image}')` }}
                      className={`relative w-14 h-14 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm`}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-md"></div>

                      <FaPlay className="text-light10 dark:text-dark10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    </div>

                    <div className="ml-2">
                      <h4 className="font-semibold text-md">
                        {song.song_name}
                      </h4>
                      {song.artist ? (
                        <Link
                          to={`/artist/${song.artist._id}`}
                          className="text-xs hover:underline"
                        >
                          {song.artist.artist_name}
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell md:w-4/12 text-center">
                  {song.album ? song.album.album_name : ""}
                </td>
                <td className="w-1/12 text-center">{`${Math.floor(
                  song.duration / 60
                )}:${song.duration % 60}`}</td>
                <td className="w-1/12 text-center">{song.streamCount}</td>
                <td className="w-1/12">
                  <IoEllipsisHorizontal
                    onClick={(e) => {
                      e.stopPropagation();
                      openMenu(e, song);
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Menu
        open={menuIsOpen}
        anchorEl={songMenuAnchor}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        autoFocus={false}
      >
        <MenuItem>
          <ListItemIcon>
            <FaRegHeart
              className="text-light10 dark:text-dark10 mt-1"
              size={18}
            />
            <ListItemText>&nbsp;Add To Favorite</ListItemText>
          </ListItemIcon>
        </MenuItem>
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
        <MenuItem className="flex items-center">
          <ListItemIcon>
            <MdLibraryMusic
              size={20}
              className="text-light10 dark:text-dark10 mr-3"
            />
            <ListItemText className="text-right">Add To Playlist</ListItemText>
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </div>
  );
}
