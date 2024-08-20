import { useEffect, useRef, useState } from "react";
import PerformRequest from "../utilities/PerformRequest.js";
import { Link } from "react-router-dom";
const ListAlbums = ({ url, idAlbum }) => {
    // const hasMounted = useRef(false);
    // const [loading, setLoading] = useState(false);
    const { OriginalRequest } = PerformRequest();
    let [albums, setAlbums] = useState([]);
    // console.table(url);
    const fetchAlbum = async () => {
        const data = await OriginalRequest(url ? url : "album/getAllAlbums", "GET");
        // const data = await OriginalRequest("album/getAllAlbums", "GET");
        if (data) {
            setAlbums(data.data);
        }
    }
    useEffect(() => {
        fetchAlbum();
    }, [url]);
    console.log(albums);
    if (idAlbum) {
        albums = albums.filter(a => a._id !== idAlbum);
    }
    return (
        <div>{albums.length>0?(<div>
            <div className="mx-auto">
                <h2 className="text-2xl font-semibold mb-8 dark:text-white ml-4">
                    More From {albums[0].artist.artist_name}
                </h2>
            </div>
            <div className="mx-auto flex flex-wrap items-center text-lightTextSecondary dark:text-darkTextSecondary">

                {albums.map((alb, index) => (
                    <Link key={index} to={`/album/${alb._id}/${alb.artist._id}`}>
                        <div className="card p-4 ml-4 mr-5 border rounded-md bg-light60 dark:bg-dark60 relative shadow-md hover:shadow-neutral-400 hover:bg-light30  dark:hover:shadow-blue-500/50 dark:hover:bg-dark30 dark:shadow-md dark:border-none mb-8">
                            <img
                                src={alb.album_cover}
                                className="ml-1 rounded-md w-40 h-40 object-cover object-center"
                            />
                            <h3 id="h3-card" className="text-lg text-lightText font-semibold dark:text-white m-2 w-40 overflow-hidden line-clamp-1">
                                {alb.album_name}
                            </h3>
                            {alb.description ? (
                                <p className="text-md text-lightTextSecondary dark:text-darkTextSecondary ml-2 w-40 h-12 overflow-hidden line-clamp-2">
                                    {alb.description}
                                </p>
                            ) : (
                                <p className="text-md text-light30 dark:text-dark30 ml-2">
                                    Null
                                </p>
                            )}

                        </div>
                    </Link>
                ))}
            </div>
        </div>):<></>}</div>
    );
}

export default ListAlbums;