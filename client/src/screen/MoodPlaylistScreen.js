import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DefaultTemplate from "../template/DefaultTemplate";
import PerformRequest from "../utilities/PerformRequest";
import SongList from "../component/SongList.js";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { IoStar } from "react-icons/io5";
import { MdLibraryMusic, MdOutlineQueueMusic } from "react-icons/md";
import auth, { setUserInfo } from "../redux/auth.js";
import { BsSoundwave, BsFolderPlus } from "react-icons/bs";
const MoodPlaylistScreen = () => {
  const [playlist, setPlaylist] = useState(null);
  const { OriginalRequest } = PerformRequest();
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const userInfo = useSelector((state) => state.auth.userInfo); // Lấy dữ liệu người dùng từ Redux store

  const dispatch = useDispatch();

  const fetchData = async () => {
    const data = await OriginalRequest(
      `playlist/getPlaylistById/${playlistId}`,
      "GET"
    );
    if (data) {
      setPlaylist(data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [playlistId]);

  return (
    <DefaultTemplate>
      <div className="w-full min-h-screen">
        <div className="container mx-auto p-4">
          {playlist && (
            <div className="relative flex items-center mb-8 bg-light30 dark:bg-dark30 rounded-lg p-6 shadow-lg">
              <div className="w-64 h-64 mr-8 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={playlist.play_list_cover}
                  alt={playlist.play_list_name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col text-lightText dark:text-darkText">
                <span className="text-sm text-lightText dark:text-darkText font-medium mb-2">
                  Playlist
                </span>
                <h2 className="text-3xl font-bold mb-2">
                  {playlist.play_list_name}
                </h2>
                <div className="flex items-center">
                  <div className="flex w-60 h-12 mr-4 mt-0.5 rounded-full overflow-hidden">
                    <BsSoundwave color="#ff5e3a" size={31} />
                    <h3 className="text-lightText dark:text-darkText font-bold text-lg">
                      Tune
                    </h3>
                    <h3 className="text-light10 font-bold text-lg">Hub</h3>
                    <span className="text-base ml-2 mt-1">•</span>
                    <p className="text-base font-semibold ml-2 mt-1">
                      {playlist.songs.length} songs
                    </p>
                  </div>
                  {/* <p className="text-base font-semibold">TuneHub</p> */}
                </div>

                <div className="w-10 right-2 absolute top-0 m-auto">
                  <p className="w-12 h-12 rounded-full  flex items-center justify-center">
                    <IoStar />
                  </p>
                </div>
              </div>
            </div>
          )}
          {playlist && (
            <SongList url={`playlist/getAllSongsByPlaylistId/${playlistId}`} />
          )}
          <br className="mt-10" />
        </div>
      </div>
    </DefaultTemplate>
  );
};

export default MoodPlaylistScreen;
