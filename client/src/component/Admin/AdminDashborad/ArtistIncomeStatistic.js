import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { RiVipDiamondFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import PerformRequest from "../../../utilities/PerformRequest";
// Correct instantiation of Intl.NumberFormat
const numberFormatter = new Intl.NumberFormat("de-DE");

export default function ArtistIncomeStatistic({ artistId, date }) {
  const { OriginalRequest } = PerformRequest();
  const [songList, setSongList] = useState([]);

  const fetchSong = async () => {
    const data = await OriginalRequest(
      `songs/getArtistSongIncome/${date}/revenue/${artistId}`,
      "GET"
    );
    if (data) {
        setSongList(data.data);
    }
  };
  useEffect(() => {
    fetchSong();
  }, [artistId, date]);

  return (
    <div className="w-full h-full text-lightText dark:text-darkText">
      <div className="w-full">
        <h4 className="font-medium p-5 text-lightText dark:text-darkText">
          Most Income Artist
        </h4>
        <table className="w-full table-fixed">
          <thead className="font-semibold">
            <tr className="border-b border-neutral-300">
              <th className="w-1/12 text-center">#</th>
              <th className="w-3/12 text-left">Artist</th>
              <th className="w-2/12 text-center">Song</th>
              <th className="w-2/12 text-center">Stream time</th>
              <th className="w-2/12 text-center">Most track</th>
              <th className="w-2/12 text-center">Purchase</th>
              <th className="w-2/12 text-center">Income</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="w-full h-80 overflow-y-auto overflow-x-hidden">
        <table className="w-full table-fixed">
          <tbody className="text-lightTextSecondary dark:text-darkTextSecondary">
            {songList.map((song, index) => (
              <tr
                key={song._id}
                className="border-b border-neutral-300 hover:bg-light30 dark:hover:bg-dark30 cursor-pointer group"
                onClick={() => console.log("hehe")}
              >
                <td className="w-1/12 text-center">{index + 1}</td>
                <td className="w-3/12 py-1">
                  <div className="flex items-center">
                    <div
                      style={{ backgroundImage: `url('${song.cover_image}')` }}
                      className="relative w-14 h-14 bg-cover bg-center flex items-center justify-center rounded-md shadow-lg shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm"
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-md"></div>
                      <FaPlay className="text-light10 dark:text-dark10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center">
                        <Link
                          to={`/songdetail/${song._id}`}
                          className="text-xs hover:underline"
                          style={{ fontSize: "1rem", lineHeight: "1rem" }}
                        >
                          {song.song_name}
                        </Link>
                        {song.is_exclusive && (
                          <RiVipDiamondFill className="text-yellow-500/50 ml-1" />
                        )}
                      </div>
                      {song.artist && (
                        <Link
                          to={`/artist/${song.artist._id}`}
                          className="text-xs hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {song.artist.artist_name}
                        </Link>
                      )}
                    </div>
                  </div>
                </td>
                <td className="w-2/12 text-center">
                  {song.album ? (
                    <Link
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      to={`/album/${song.album._id}/${song.artist._id}`}
                    >
                      {song.album.album_name}
                    </Link>
                  ) : (
                    ""
                  )}
                </td>
                <td className="text-center w-2/12">
                  {numberFormatter.format(song.streamCount)}
                </td>
                <td className="text-center w-2/12">
                  {numberFormatter.format(song.price)}
                </td>
                <td className="text-center w-2/12">
                  {numberFormatter.format(song.totalRevenue)}
                </td>
                <td className="text-center w-2/12">
                  {numberFormatter.format(song.totalRevenue * 0.9)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
