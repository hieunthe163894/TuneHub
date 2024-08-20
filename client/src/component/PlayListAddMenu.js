import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PerformRequest from "../utilities/PerformRequest";

const PlayListAddMenu = ({ songId }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const {OriginalRequest} = PerformRequest();
  const handlePlaylistClick = async (e, playlistId) => {
    console.log(songId);
    const result = await OriginalRequest("playlist/push", "POST", {
        playlistId: playlistId,
        songs: songId._id
    })

  };


  return (
    <div className="px-3 mt-2">
      <div className="px-3 text-textSecondary text-lightText text-sm font-medium">
        {userInfo.playlist_created?.map((playlist) => (
          // !playlist.songs.find(song => song.songId === songId) && // Sử dụng songId từ props để kiểm tra
          <div
            key={playlist._id}
            onClick={(e) => handlePlaylistClick(e, playlist.playlistId)}
            className="flex items-center mb-3 cursor-pointer"
          >
            <img
              className="w-10 h-10 rounded-full border-slate-600 border-2 text-lightText dark:text-darkText"
              src={playlist.play_list_cover}
              alt={playlist.play_list_name}
            />
            &nbsp;
            &nbsp;<span>{playlist.play_list_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayListAddMenu;
