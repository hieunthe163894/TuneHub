import React, { useEffect, useState } from "react";
import DefaultTemplate from "../template/DefaultTemplate";
import { FaPlay, FaShoppingCart } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiVipDiamondFill } from "react-icons/ri";
import { BsCartCheck } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { CiPlay1 } from "react-icons/ci";
import "../style/detailalbum.css";
import {
  setCurrentSong,
  toogleIsPlaying,
  addSongToQueue,
  setQueueIndex,
} from "../redux/player.js";
import { setSongQueue } from "../redux/songQueue.js";
import { Link, useParams } from "react-router-dom";
import SongList from "../component/SongList.js";
import PerformRequest from "../utilities/PerformRequest.js";
import AlbumList from "../component/AlbumsList.js";
import ListAlbums from "../component/ListAlbums.js";
import { useDispatch, useSelector } from "react-redux";
import NoSpaceHeaderTemplate from "../template/NoSpaceHeaderTemplat.js";
import toast from "react-hot-toast";
const DetailAlbum = () => {
  const { OriginalRequest } = PerformRequest();
  const dispatch = useDispatch();
  const { id, artistId } = useParams();
  const [album, setAlbum] = useState({});
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const fetchAlbum = async () => {
    const data = await OriginalRequest(`album/getAlbumById/${id}`, "GET");
    if (data) {
      setAlbum(data.data);
    }
  };
  const fetchAlbumOfArtist = async () => {
    const data = await OriginalRequest(
      `album/getAlbumsOfArtist/${artistId}`,
      "GET"
    );
    if (data) {
      setAlbums(data.data);
    }
  };
  const fetchGetSongByAlbum = async () => {
    const data = await OriginalRequest(`songs/getSongByAlbum/${id}`, "GET");
    if (data) {
      setSongs(data.data);
    }
  };
  const formatCreatedAt = (createdAt) => {
    if (createdAt) {
      return createdAt.split("T")[0];
    }
    return "";
  };
  useEffect(() => {
    fetchAlbum();
    fetchAlbumOfArtist();
    fetchGetSongByAlbum();
  }, [id]);
  return (
    <NoSpaceHeaderTemplate>
      <div className="overflow-hidden min-h-screen">
        <div className="profileHeader w-full relative h-96 mb-4">
          <div
            style={{
              backgroundColor: album.background,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              filter: "blur(5px)",
            }}
            className="w-full bg-center h-96 bg-cover"
          ></div>
          <div className={`w-full h-full pt-56 relative`}>
            <div className="bg-light60 dark:bg-dark30 max-w h-44 rounded-lg m-10 shadow-lg">
              <div className="flex items-center h-full pl-5 ">
                <div
                  style={{ backgroundImage: `url(${album.album_cover})` }}
                  className={`w-40 h-36 rounded-lg relative bg-cover bg-center flex items-center justify-center group`}
                >
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-md"></div>
                  <FaPlay
                    className="size-9 text-light10 dark:text-dark10 z-10 opacity-0 group-hover:opacity-100 hover:cursor-pointer"
                    key={album._id}
                    onClick={(e) => {
                      dispatch(setSongQueue(songs));
                      dispatch(setCurrentSong(songs[0]));
                      dispatch(toogleIsPlaying(true));
                    }}
                  />
                </div>
                <div className="flex justify-between px-5 py-3 h-full w-full">
                  <div className="text-lightText dark:text-darkText">
                    <div className="flex flex-col justify-around h-full">
                      <div>
                        <p className="text-2xl font-medium flex items-center">
                          {album.album_name} &nbsp;
                          {userInfo &&
                          userInfo &&
                          userInfo?.albums_purchased?.includes(album._id) ? (
                            <div className="bg-sky-600/70 px-2 rounded-md font-semibold text-base">
                              OWNED
                            </div>
                          ) : (
                            <RiVipDiamondFill
                              size={20}
                              className="text-[#E6CA69]"
                            />
                          )}
                        </p>
                        <div className="flex items-center text-md text-lightTextSecondary dark:text-darkTextSecondary">
                          <p>{album.artist_name} &nbsp;</p>
                          <GoDotFill size={10} />
                          <p>
                            &nbsp; {formatCreatedAt(album.createdAt)} &nbsp;
                          </p>
                          <GoDotFill size={10} />
                          <p className=" text-lightTextSecondary dark:text-darkTextSecondary ">
                            &nbsp;
                            {album.song_count} Songs &nbsp;
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <CiPlay1
                          size={28}
                          className=" hover:cursor-pointer"
                          onClick={(e) => {
                            dispatch(setSongQueue(songs));
                            dispatch(setCurrentSong(songs[0]));
                            dispatch(toogleIsPlaying(true));
                          }}
                        />
                        {userInfo &&
                        !userInfo?.albums_purchased?.includes(album._id) ? (
                          <Link
                            to={`/payment/purchaseAlbum/${id}`}
                            className="text-lightTextSecondary dark:text-darkTextSecondary ml-3"
                          >
                            <MdOutlineAttachMoney
                              size={28}
                              className="hover:cursor-pointer"
                            />
                          </Link>
                        ) : (
                          <BsCartCheck
                            size={28}
                            className="hover:cursor-pointer"
                            onClick={(e) => {
                              if (
                                userInfo &&
                                userInfo?.albums_purchased?.includes(album._id)
                              ) {
                                e.preventDefault();
                                toast.error("Album owned");
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-14">
          <SongList url={`songs/getSongByAlbum/${id}`} />
        </div>
        <div className="more-album-contain">
          <div className="w-full p-7 ">
            <ListAlbums
              url={`album/getAlbumsOfArtist/${artistId}`}
              idAlbum={id}
            />
          </div>
        </div>
      </div>
    </NoSpaceHeaderTemplate>
  );
};

export default DetailAlbum;
