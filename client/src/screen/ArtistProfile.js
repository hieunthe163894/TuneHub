import { useParams } from "react-router";
import NoSpaceHeaderTemplate from "../template/NoSpaceHeaderTemplat";
import { useDispatch, useSelector } from "react-redux";
import { setScrollPos } from "../redux/window";
import { useEffect, useRef, useState } from "react";
import SongList from "../component/SongList";
import AlbumList from "../component/AlbumsList";
import PerformRequest from "../utilities/PerformRequest";
import FeaturedIn from "../component/artistProfile/FeaturedIn";
import { setUserInfo } from "../redux/auth.js";
import { useNavigate } from "react-router-dom";
export default function ArtistProfile() {
  const dispatch = useDispatch();
  const { artistId } = useParams();
  const scrollPos = useSelector((state) => state.window.scrollPos);
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  const [followed, setFollowed] = useState(false);
  const navigate = useNavigate();
  const checkFollowed = async () => {
    try {
      const check = await OriginalRequest(
        `user/checkFollowed/${artistId}`,
        "GET"
      );
      setFollowed(check);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowArtist = async () => {
    try {
      await OriginalRequest(`user/follow/`, "POST", { artistId });
      setFollowed(!followed);

      const user = await OriginalRequest("auth/user", "GET");
      dispatch(setUserInfo(user.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkFollowed();
    const handleScroll = () => {
      dispatch(setScrollPos(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [artistInfo, setArtistInfo] = useState({});
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const artist = await OriginalRequest(
          `artists/getArtistInfo/${artistId}`,
          "GET"
        );
        console.log(artist.data);
        setArtistInfo(artist.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchInfo();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted, followed, artistId]);
  return (
    <NoSpaceHeaderTemplate>
      <div className="w-full min-h-screen">
        {artistInfo._id && (
          <div>
            <div className="profileHeader w-full h-96 relative">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: `url('${artistInfo.userId.profile_picture}')`,
                  filter: "blur(4px)",
                  zIndex: 1,
                }}
              ></div>
              <div
                className="absolute inset-0 bg-light30 dark:bg-dark30"
                style={{ opacity: `${(scrollPos * 0.7) / 180}`, zIndex: 2 }}
              ></div>
              <div className="w-full h-full pt-56 relative z-10">
                <div className="flex items-center pl-12">
                  <img
                    className="object-cover object-center aspect-square w-36 rounded-full border-2 border-lightTextSecondary dark:border-darkTextSecondary"
                    src={artistInfo.userId.profile_picture}
                  />
                  <div>
                    <h1 className="ml-5 text-6xl font-bold text-white">
                      {artistInfo.artist_name}
                    </h1>
                    <p className="ml-5 text-darkTextSecondary">
                      {artistInfo.followersCount} followers
                    </p>
                    <div className="flex items-center mt-1 pl-2">
                      {!followed ? (
                        <button
                          onClick={handleFollowArtist}
                          className="z-50 cursor-pointer border-2 border-light10 px-5 py-1 text-white rounded-full ml-2 font-bold"
                        >
                          Follow
                        </button>
                      ) : (
                        <button
                          onClick={handleFollowArtist}
                          className="z-50 cursor-pointer bg-orange-500 border-2 border-light10 px-5 py-1 text-white rounded-full ml-2 font-bold"
                        >
                          Followed
                        </button>
                      )}
                      <button
                        className="z-50 cursor-pointer text-white rounded-full ml-5 font-bold border-light10 border-2 px-5 py-1"
                        onClick={(e) => {
                          navigate(`/donateArtist/${artistId}`);
                        }}
                      >
                        Donate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-24 w-full bg-gradient-to-b from-light30 to-light60 dark:from-dark30 dark:to-dark60 transition-all"></div>
            <div className="px-9">
              <h4 className="text-lightText dark:text-darkText font-semibold text-xl">
                Popular Tracks
              </h4>
              <div className="px-3">
                <SongList url={`songs/getArtistPopularSongs/${artistId}`} />
              </div>
              <h4 className="text-lightText dark:text-darkText font-semibold text-xl mt-7">
                Albums
              </h4>
              <AlbumList url={`album/getAlbumsOfArtist/${artistId}`} />

              <FeaturedIn url={`songs/getFeaturedSongs/${artistId}`} />
            </div>
          </div>
        )}
        <div className="h-10"></div>
      </div>
    </NoSpaceHeaderTemplate>
  );
}
