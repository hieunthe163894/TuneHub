import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ListPlaylist = ({ songId }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  // const [playlists, setPlaylists] = useState([]);
  const handlePlaylistClick = (e, playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };


  return (
    <div className="px-3 mt-2">
      <div className="text-textSecondary text-lightText dark:text-darkText text-sm font-medium cursor-pointer">
        {userInfo.playlist_created?.map((playlist) => (
          // !playlist.songs.find(song => song.songId === songId) && // Sử dụng songId từ props để kiểm tra
          <div
            key={playlist._id}
            // onContextMenu={(e) => handleContextMenu(e, playlist)}
            onMouseDown={(e) => handlePlaylistClick(e, playlist.playlistId)}
            className="flex items-center mb-3 hover:underline"
          >
            <img
              className="w-10 h-10 rounded-full border-slate-600 border-2 text-lightText dark:text-darkText object-cover object-center"
              src={playlist.play_list_cover}
              alt={playlist.play_list_name}
            />
            &nbsp;<span>{playlist.play_list_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListPlaylist;
