import { useEffect, useState } from "react";
import PerformRequest from "../../utilities/PerformRequest";
import { Link } from "react-router-dom";

export default function TopArtist() {
  const [ArtistList, setArtist] = useState([]);
  const { OriginalRequest } = PerformRequest();
  const fetchArtist = async () => {
    const data = await OriginalRequest("artists/leaderboard/topArtist", "GET");
    if (data) {
      setArtist(data.data);
    }
  };
  useEffect(() => {
    fetchArtist();
  }, []);
  return (
    <div className="w-full mb-5">
      <div className="mx-auto">
        <h4 className="text-2xl font-semibold mb-8 dark:text-white ml-4 pl-12">
          Top Artist
        </h4>
      </div>
      <div className="mx-auto w-11/12 flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary">
        {ArtistList.slice(0,5 ).map((artist, index) => (
          <div
            key={artist._id}
            className="card mx-2 px-3 pt-2 pb-4 border rounded-md hover:bg-light30 hover:dark:bg-dark30 relative hover:shadow-md shadow-neutral-400 dark:shadow-blue-700/50 dark:shadow-md dark:border-none"
          >
            <img
              src={artist.artist_file.profile_picture}
              className="rounded-full w-48 h-48 mx-auto object-cover object-center"
            />
            <h3 className="text-lg font-semibold dark:text-white ml-5">
              {artist && (
                <>
                  <Link
                    to={`/artist/${artist._id}`}
                    className="text-xs hover:underline"
                    style={{ fontSize: "1.125rem", lineHeight: "1.25rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {artist.artist_name}
                  </Link>
                </>
              )}
            </h3>

            {artist.artist_file.introduction ? (
              <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-5 line-clamp-2 w-32 h-12">
                {artist.artist_file.introduction}
              </p>
            ) : (
              <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-5 line-clamp-2 w-32 h-12"></p>
            )}

            {/* <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2">
              Follow: {artist.followers_count}
            </p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
