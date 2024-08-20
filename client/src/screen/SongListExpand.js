import { useParams } from "react-router-dom";
import SongList from "../component/SongList";
import { useEffect, useState } from "react";
import DefaultTemplate from "../template/DefaultTemplate";
import { FaSearch } from "react-icons/fa";

export default function SongListExpand({ }) {
  const { url, title } = useParams();
  const [songType, setSongType] = useState("All");
  const [searchSong, setSearchSong] = useState('');
  useEffect(() => {
    console.log(url);
  }, []);
  const titleSplited = title.split("-").join(" ");
  const urlFormated = url.split("-").join("/");
  return (
    <DefaultTemplate>
      <div className="w-full min-h-screen">
        <h4 className="text-2xl font-semibold mb-8 dark:text-white pl-12">
          {titleSplited}
        </h4>
        <div className="flex items-center pl-12 text-lightText dark:text-darkText">
          <button
            className={`px-5 rounded-md py-1 border border-light10 dark:border-dark10 mr-5  ${songType === "All" ? "bg-light10 dark:bg-dark10" : ""
              }`}
            onClick={(e) => {
              setSongType("All");
            }}
          >
            All
          </button>
          <button
            className={`px-5 rounded-md py-1 border border-light10 dark:border-dark10 mr-5 ${songType === "Exclusive" ? "bg-light10 dark:bg-dark10" : ""
              }`}
            onClick={(e) => {
              setSongType("Exclusive");
            }}
          >
            Exclusive
          </button>
          <button
            className={`px-5 rounded-md py-1 border border-light10 dark:border-dark10 mr-5 ${songType === "Free" ? "bg-light10 dark:bg-dark10" : ""
              }`}
            onClick={(e) => {
              setSongType("Free");
            }}
          >
            Free
          </button>
          <div className="ml-10 flex items-center bg-opacity-80 border border-gray-500 rounded-full px-4 py-1 w-1/2">
            <input
              label="Search by name"
              value={searchSong}
              onChange={e => setSearchSong(e.target.value)}
              className="w-full outline-none bg-transparent dark:text-white"
            />
            <button className="ml-2 text-dark10 rounded-full p-2">
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="px-12">
          <SongList url={`${urlFormated}?limit=50&songType=${songType}&songName=${searchSong}`} />
        </div>
      </div>
    </DefaultTemplate>
  );
}
