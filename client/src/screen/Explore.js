import DefaultTemplate from "../template/DefaultTemplate";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import SongList from "../component/SongList";
import PerformRequest from "../utilities/PerformRequest.js";
import { color } from "framer-motion";
import { red } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import '../style/explore.css'

function Explore() {
  const { OriginalRequest } = PerformRequest();

  const [artistList, setArtistList] = useState([]);
  const [risingArtist, setRisingArtist] = useState([]);
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);

  const searchValue = useSelector((state) => state.search.searchKey);
  console.log(searchValue);

  useEffect(() => {
    const fetch = async () => {
      const searchArtistValue = await OriginalRequest(
        `artists/search/${searchValue}`,
        "GET"
      );
      if (searchArtistValue) {
        setArtistList(searchArtistValue.data);
      }
    };
    fetch();
  }, [searchValue]);

  useEffect(() => {
    const fetchRising = async () => {
      const risingArtist = await OriginalRequest(
        `artists/explore/rising`,
        "GET"
      );
      if (risingArtist) {
        setRisingArtist(risingArtist.data);
      }
    };
    fetchRising();

    const fetchGenres = async () => {
      const genresSong = await OriginalRequest(`genres/`, "GET");
      if (genresSong) {
        setGenres(genresSong.data.slice(0, 12));
      }
    };
    fetchGenres();

    const fetchMoods = async () => {
      const genresSong = await OriginalRequest(
        `playlist/getAllMoodsByUserId`,
        "GET"
      );
      if (genresSong) {
        setMoods(genresSong.data);
      }
    };
    fetchMoods();
  }, []);

  const navigate = useNavigate();
  const handlePlaylistClick = (e, playlistId) => {
    navigate(`/mood/${playlistId}`);
  };

  return (
    <DefaultTemplate>
      <div className="w-full min-h-screen items-center justify-center px-10">
        {!searchValue ? (
          <>
            <div className="w-full pt-8 ">
              <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-8 dark:text-white ml-4">
                  Genres
                </h2>
              </div>
              <div className="container mx-auto flex flex-wrap items-center">
                {genres.map((genre, index) => (
                  <Link to={`/songsByGenre/${genre._id}/${genre.name}`}>
                    <div
                      style={{
                        backgroundColor: genre.bgColor ? genre.bgColor : "red",
                      }}
                      className="card w-48 h-72 ml-4 mr-5 mb-10 border rounded-lg relative shadow-2xl shadow-neutral-400 dark:shadow-blue-800 dark:shadow-sm overflow-hidden"
                    >
                      <h3 className="text-lg text-white font-bold p-2">
                        {genre.name}
                      </h3>
                      <img
                        src={
                          genre.image
                            ? genre.image
                            : "https://i.pinimg.com/736x/90/57/0a/90570addee2645866a597530721f37fd.jpg"
                        }
                        className="absolute bottom-0 right-0 w-32 h-32 object-cover object-center transform rotate-12 translate-x-3 translate-y-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="w-full pt-8 ">
              <div className="mx-auto">
                <h2 className="text-2xl font-bold mb-8 dark:text-white ml-4">
                  Rising Artist
                </h2>
              </div>
              <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary">
                {risingArtist.map((artist, index) => (
                  <Link
                    to={`/artist/${artist._id}`}
                    className="text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="card p-4 ml-4 mr-5 mb-10 border rounded-md bg-light30 dark:bg-dark30 relative shadow-md shadow-neutral-400 dark:shadow-blue-500/50 dark:shadow-md dark:border-none">
                      <img
                        src={artist.user?.profile_picture}
                        className="rounded-full w-40 h-40 object-cover object-center"
                      />
                      <h3 className="text-lg font-semibold dark:text-white m-2 hover:underline">
                        {artist.artist_name}
                      </h3>
                      {artist.user?.introduction ? (
                        <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary line-clamp-2 w-32 h-12 mb-2">
                          {artist.user?.introduction}
                        </p>
                      ) : (
                        <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary line-clamp-2 w-32 h-12 mb-2"></p>
                      )}

                      <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary">
                        Follow: {artist.artist_followed_count}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full pt-8 ">
              <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-8 dark:text-white ml-4">
                  Mood and activity playlists
                </h2>
              </div>
              <div className="container mx-auto flex flex-wrap items-center">
                {moods.map((artist, index) => (
                  <div
                    className="w-80 h-44 card m-3 mb-4 border rounded-sm bg-light30 dark:bg-dark30 relative shadow-md shadow-neutral-200 dark:shadow-blue-300 dark:shadow-md dark:border-none"
                    onClick={(e) => handlePlaylistClick(e, artist._id)}
                  >
                    <img
                      src={artist.play_list_cover}
                      className="rounded-md w-full h-full object-cover object-center filter brightness-75"
                    />
                    <h3 className="absolute top-2 left-2 text-lg font-semibold text-white m-2">
                      {artist.play_list_name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-8 dark:text-white ml-4 mt-4">
              Songs
            </h2>
            <SongList url={`songs/search/${searchValue}`} />

            <div className="w-full pt-8 ">
              <div className="mx-auto">
                <h2 className="text-2xl font-bold mb-8 dark:text-white ml-4">
                  Artist
                </h2>
              </div>
              {artistList.length > 0 ? (
                <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary">
                  {artistList.map((artist, index) => (
                    <Link
                      to={`/artist/${artist._id}`}
                      className="text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="card p-4 ml-4 mr-5 mb-10 border rounded-md bg-light30 dark:bg-dark30 relative shadow-md shadow-neutral-400 dark:shadow-blue-500/50 dark:shadow-md dark:border-none">
                        <img
                          src={artist.user?.profile_picture}
                          className="rounded-full w-40 h-40 object-cover object-center"
                        />
                        <h3 className="text-lg font-semibold dark:text-white m-2 hover:underline">
                          {artist.artist_name}
                        </h3>
                        <p className="text-md w-40 text-lightTextSecondary dark:text-darkTextSecondary ml-2 line-clamp-2">
                          {artist.user?.introduction}
                        </p>
                        <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2">
                          Follow: {artist.artist_followed_count}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <img
                  className="m-auto"
                  src="https://static.thenounproject.com/png/2962127-200.png"
                />
              )}
            </div>
          </>
        )}
      </div>
    </DefaultTemplate>
  );
}

export default Explore;
