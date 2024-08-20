import { useDispatch, useSelector } from "react-redux";
import { FaPlay } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { CgLoadbarSound } from "react-icons/cg";
import { setCurrentSong, toogleIsPlaying } from "../redux/player";
import { setQueueIndex, setSongQueue } from "../redux/songQueue";
export default function SongQueue() {
  const dispatch = useDispatch();
  const queueIndex = useSelector((state) => state.songQueue.queueIndex);
  const songQueue = useSelector((state) => state.songQueue.songQueue);
  const showBox = useSelector((state) => state.player.showBox);
  const currentSong = useSelector((state) => state.player.currentSong);
  const removeSongFromQueue = (index) => {
    const updatedSongQueue = [...songQueue];
    updatedSongQueue.splice(index, 1);
    console.log(updatedSongQueue);
    dispatch(setSongQueue(updatedSongQueue));
    if (queueIndex > index) {
      dispatch(setQueueIndex(queueIndex - 1));
    } else {
      if (queueIndex === index) {
        if (updatedSongQueue.length > 0) {
          dispatch(setCurrentSong(updatedSongQueue[index]));
        } else {
          console.log(updatedSongQueue);
          dispatch(setCurrentSong({}));
        }
      }
    }
  };
  return (
    <div
      className={`z-[1000] w-72 h-96 bg-light30 dark:bg-dark30 border border-light10/30 dark:border-dark10/40 fixed bottom-28 right-5 rounded-sm shadow-lg py-1 ${
        showBox ? "" : "hidden"
      }`}
    >
      <h4 className="px-4 text-lightText dark:text-darkText font-semibold">
        Song Queue
      </h4>
      <div className="h-full pb-8">
        <div className="h-full overflow-y-auto">
          {songQueue.map((song, index) => (
            <div
              key={song._id}
              className={`cursor-pointer w-full py-2 flex items-center justify-between hover:bg-[#cdc8a5] group dark:hover:bg-slate-700 ${
                currentSong._id === songQueue[index]._id
                  ? "bg-light5 group dark:bg-slate-700"
                  : ""
              }`}
              onClick={(e) => {
                dispatch(setCurrentSong(song));
                dispatch(toogleIsPlaying(true));
                dispatch(setQueueIndex(index));
              }}
            >
              <div className="ml-4 songInfo w-8/12 flex items-start overflow-hidden text-ellipsis">
                <img
                  src={song.cover_image}
                  className="h-14 w-14 object-cover object-center rounded-md"
                />
                <div className="ml-2">
                  <h4
                    className={`w-full font-semibold text-sm group-hover:text-white ${
                      currentSong._id === songQueue[index]._id
                        ? "text-lightText dark:text-darkText"
                        : "text-lightTextSecondary dark:text-darkTextSecondary"
                    } text-ellipsis`}
                  >
                    {song.song_name}
                  </h4>
                  <h6
                    className={`font-normal text-xs group-hover:text-darkText ${
                      currentSong._id === songQueue[index]._id
                        ? "text-lightTextSecondary dark:text-darkText"
                        : "text-lightTextSecondary dark:text-darkTextSecondary"
                    } `}
                  >
                    {song.artist ? song.artist.artist_name : "Unknown Artist"}
                  </h6>
                </div>
              </div>
              <div className="h-full w-3/12 flex items-center justify-between">
                {currentSong._id === songQueue[index]._id ? (
                  <CgLoadbarSound
                    className="text-green-500 right-2 relative"
                    size={30}
                  />
                ) : (
                  <FaPlay
                    className={`mr-4 group-hover:text-darkText text-lightTextSecondary dark:text-darkTextSecondary`}
                    size={15}
                  />
                )}

                <AiFillDelete
                  className={`mr-4 group-hover:text-darkText ${
                    currentSong._id === songQueue[index]._id
                      ? "text-white dark:text-darkText"
                      : "text-lightTextSecondary dark:text-darkTextSecondary"
                  }`}
                  size={20}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSongFromQueue(index);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
