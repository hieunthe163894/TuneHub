import { useEffect, useRef, useState } from "react";
import PerformRequest from "../utilities/PerformRequest";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import {
    setCurrentSong,
    toogleIsPlaying,
    addSongToQueue
} from "../redux/player.js";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
export default function SongListDetail({ url, onSongChange }) {
    const [SongList, setSongList] = useState([]);
    const { OriginalRequest } = PerformRequest();
    const dispatch = useDispatch();
    const hasMounted = useRef(false);
    const [songMenuAnchor, setSongMenuAnchor] = useState(null);
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [songInAction, setSongInAction] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleFavouriteClick = async (songId) => {
        try {
            const response = await OriginalRequest(`songs/favourited/${songId}`, "POST");
            if (response) {
                const updatedSongList = [...SongList]
                updatedSongList.map((song, index) => {
                    if (song._id === response.result._id) {
                        song.favouritedByUser = response.favourited
                    }
                })
                setSongList(updatedSongList);
            }
        } catch (error) {
            console.error("Error toggling favourite:", error);
        }
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

    useEffect(() => {
        const fetch = async () => {
            if (hasMounted.current) {
                try {
                    setLoading(true);
                    const data = await OriginalRequest(url ? url : "songs/getHotestSong", "GET");
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
        <div className="w-full flex items-center mt-5 overflow-x-hidden">
            <table className="w-full text-lightText dark:text-darkText overflow-x-hidden">
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
                    {SongList.map((song, index) => (
                        <tr
                            className="border-b border-neutral-300  hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
                            key={song._id}
                            onClick={(e) => {
                                dispatch(setCurrentSong(song));
                                dispatch(toogleIsPlaying(true));
                                navigate(`/songdetail/${song._id}`);
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
                                        <h6 className="text-xs">
                                            {song.artist ? (
                                                <Link
                                                    to={`/artist/${song.artist._id}`}
                                                    className="text-xs hover:underline"
                                                    onClick={(e) => { e.stopPropagation() }}
                                                >
                                                    {song.artist.artist_name}
                                                </Link>
                                            ) : (
                                                <></>
                                            )}
                                            {song.participated_artists && song.participated_artists.length >= 0 && (
                                                <>
                                                    {song.participated_artists.map((artist, index) => (
                                                        <span key={index}>
                                                            {index >= 0 && ', '}
                                                            <Link
                                                                to={`/artist/${artist._id}`}
                                                                className="text-xs hover:underline"
                                                                onClick={(e) => { e.stopPropagation() }}
                                                            >
                                                                {artist.artist_name}
                                                            </Link>
                                                        </span>
                                                    ))}
                                                </>
                                            )}
                                        </h6>
                                    </div>
                                </div>
                            </td>
                            <td className="w-4/12">
                                {song.album.album_name ? song.album.album_name : ""}
                            </td>
                            <td className="w-1/12">{song.streamCount}</td>
                            <td className="w-1/12">{Math.floor(song.duration / 60)}:{song.duration % 60}</td>

                            <td className="w-1/12 ">
                                <div className="flex items-center justify-evenly">
                                    <div id={song._id}>
                                        {!song.favouritedByUser ?
                                            <FaRegHeart
                                                className="text-light10 dark:text-dark10 mt-1"
                                                size={18}
                                                onClick={(e) => {
                                                    handleFavouriteClick(song._id);
                                                    e.stopPropagation()
                                                }}
                                            />
                                            :
                                            <BsHeartFill
                                                className="text-light10 dark:text-dark10 mt-1"
                                                size={18}
                                                onClick={(e) => {
                                                    handleFavouriteClick(song._id);
                                                    e.stopPropagation()
                                                }}
                                            />
                                        }
                                    </div>
                                    <IoEllipsisHorizontal onClick={(e) => {
                                        e.stopPropagation();
                                        openMenu(e, song);
                                    }} />
                                </div>
                            </td>
                        </tr>
                    ))}
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
