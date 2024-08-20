import { FaSearch } from "react-icons/fa";
import HeadlessTippy from "@tippyjs/react/headless";
import { useState, useEffect } from "react";
import useDebounce from "./useDebounce.js";
import PerformRequest from "../../utilities/PerformRequest.js";
import { addKeySearch } from "../../redux/search.js";
import { useDispatch } from "react-redux";

function Search() {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const { OriginalRequest } = PerformRequest();

  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchValue("");
      dispatch(addKeySearch(""));
    }

    dispatch(addKeySearch(debouncedValue));
  }, [debouncedValue]);

  // useEffect(() => {
  //   if (!debouncedValue.trim()) {
  //     setSearchValue("");
  //     dispatch(clearData([]));
  //   }
  //   const fetch = async () => {
  //     const songList = await OriginalRequest(
  //       `songs/search/${debouncedValue}`,
  //       "GET"
  //     );
  //     if (songList) {
  //       dispatch(addData(songList));
  //     } else {
  //       dispatch(clearData([]));
  //     }
  //   };
  //   fetch();
  // }, [debouncedValue]);

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };

  return (
    <form className="w-1/3 m-auto flex items-center bg-opacity-80 border border-gray-300 rounded-full px-4 py-1 w-1/3">
      <input
        value={searchValue}
        type="text"
        placeholder="Search"
        className="w-full outline-none bg-transparent dark:text-white"
        onChange={handleChange}
        // onFocus={() => setShowResult(true)}
      />
      <button type="submit" className="ml-2 text-dark10 rounded-full p-2">
        <FaSearch />
      </button>
    </form>
  );
}

export default Search;
