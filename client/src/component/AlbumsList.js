import { useEffect, useRef, useState } from "react";
import PerformRequest from "../utilities/PerformRequest";
import { Link } from "react-router-dom";

export default function AlbumList({ url }) {
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      if (hasMounted.current) {
        try {
          setLoading(true);
          const data = await OriginalRequest(url, "GET");
          if (data) {
            setAlbums(data.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        hasMounted.current = true;
      }
    };
    fetch();
  }, [hasMounted, url]);
  return (
    <div className="mt-5 ">
      {albums.length > 0 ? (
        <div className="w-full flex flex-wrap">
          {albums.map((album) => (
            <div
              key={album.id}
              className="card border lg:w-2/12 md:w-4/12 sm:w-6/12 pb-2 rounded hover:bg-light30 hover:dark:bg-dark30 hover:shadow-md hover:shadow-neutral-400 hover:dark:shadow-blue-600/40 dark:border-none"
            >
              <div className="p-2 mt-2">
                <img
                  src={album.album_cover}
                  className="w-44 h-44 rounded-md mx-auto border-2 border-neutral-400/20 object-cover object-center"
                />
              </div>
              <div className="lg:px-3 md:px-3 sm:px-8">
                <p className="text-lightText dark:text-darkText font-medium line-clamp-1 overflow-ellipsis hover:underline">
                  {album.album_name ? (
                    <Link
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(album);
                      }}
                      to={"/album/" + album._id + "/" + album.artist._id}
                    >
                      {album.album_name}
                    </Link>
                  ) : (
                    ""
                  )}
                </p>
                <p className="text-lightTextSecondary text-sm dark:text-darkTextSecondary line-clamp-2 overflow-ellipsis">
                  {album.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center pt-8">
          <span>No Album found</span>
        </div>
      )}
    </div>
  );
}
