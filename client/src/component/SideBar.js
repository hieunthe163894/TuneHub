import SideBarItem from "./SideBarItem";
import { FaHome, FaSearch, FaChartBar, FaPlus, FaUser } from "react-icons/fa";
import { MdLibraryMusic } from "react-icons/md";
import { LuChevronLast, LuChevronFirst } from "react-icons/lu";
import { createContext, useEffect, useState, useCallback } from "react";
import { BsSoundwave, BsFolderPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toogleExpand } from "../redux/sideBar.js";
import ListPlaylist from "./ListPlaylist";
import PerformRequest from "../utilities/PerformRequest.js";
import { Modal, Box, Typography, Button } from "@mui/material";
import auth, { setUserInfo } from "../redux/auth.js";
import { Link, useNavigate } from "react-router-dom";

export default function SideBar() {
  // const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const expanded = useSelector((state) => state.sideBar.expanded);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [playlistName, setPlaylistName] = useState("Playlist default");
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      // setExpanded(window.innerWidth > 768);
      dispatch(toogleExpand(window.innerWidth > 768));
      // console.log(window.location.href);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [baseImage, setBaseImage] = useState(
    "https://res.cloudinary.com/djzdhtdpj/image/upload/v1704269768/tempAvatar_juqb4s.jpg"
  );

  const handleImageInputChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);

    document.getElementById("chooseImageText").innerText = file.name;
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const { OriginalRequest } = PerformRequest();

  const handleCreatePlaylist = async () => {
    const fetch = async () => {
      const searchArtistValue = await OriginalRequest(
        `playlist/create`,
        "POST",
        {
          play_list_name: playlistName,
          play_list_cover: baseImage,
          creator: userInfo,
        }
      );

      console.log(searchArtistValue);
    };
    await fetch();
    setPlaylistName("Playlist default");
    const user = await OriginalRequest("auth/user", "GET");
    if (user) {
      dispatch(setUserInfo(user.data));
    }

    closeModal();
  };

  return (
    <div
      className={`h-screen fixed top-0 left-0 bg-light60 dark:bg-dark60 overflow-hidden transition-all z-60 ${expanded ? "w-60" : "w-20"
        }`}
    >
      <nav className="h-full flex flex-col border-r shadow-lg border-lightTextSecondary dark:border-darkTextSecondary">
        <div className="p-4 flex items-center justify-between">
          <div
            className={`flex items-center overflow-hidden transition-all ${expanded ? "w-36" : "w-0"
              }`}
          >
            <BsSoundwave color="#ff5e3a" size={33} />
            <h3 className="text-lightText dark:text-darkText font-bold text-xl">
              Tune
            </h3>
            <h3 className="text-light10 font-bold text-xl">Hub</h3>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-light30 hover:dark:bg-dark30"
            onClick={(e) => dispatch(toogleExpand(!expanded))}
          >
            {expanded ? (
              <LuChevronFirst
                className="text-lightText dark:text-darkTextSecondary"
                size={32}
              />
            ) : (
              <LuChevronLast
                className="text-lightText dark:text-darkTextSecondary"
                size={32}
              />
            )}
          </button>
        </div>

        <ul className="flex-col px-3">
          <SideBarItem
            icon={
              <FaHome size={22} className="text-lightText dark:text-darkText" />
            }
            text={"Homepage"}
            url={"/"}
            active={window.location.href === "http://localhost:3000/"}
          />
          <SideBarItem
            icon={
              <FaSearch
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"Explore"}
            url={"/explore"}
            active={window.location.href === "http://localhost:3000/explore"}
          />
          <SideBarItem
            icon={
              <FaChartBar
                size={22}
                className="text-lightText dark:text-darkText"
              />
            }
            text={"Leaderboard"}
            url={"/leaderboard"}
            active={
              window.location.href === "http://localhost:3000/leaderboard"
            }
          />
        </ul>
        <hr
          className={`mx-auto overflow-hidden border-lightText dark:border-darkText transition-all ${expanded ? "w-3/5" : "w-0"
            }`}
        />
        <div className="flex-1 flex-col relative">
          <div className="px-3 mt-2">
            <div className="flex font-medium text-textSecondary py-2 items-center px-3 justify-between">
              <div className="flex items-center">
                <MdLibraryMusic
                  size={22}
                  className="text-lightText dark:text-darkText"
                />

                <span
                  className={`overflow-hidden transition-all text-lightText dark:text-darkText ${expanded ? "w-24" : "w-0 hidden"
                    }`}
                >
                  &nbsp;Your Library
                </span>
              </div>
              <div className="relative">
                <button
                  className={`overflow-hidden transition-all text-lightText dark:text-darkText ${expanded ? "w-5" : "w-0 hidden"
                    }`}
                  onClick={openModal}
                >
                  <FaPlus size={22} />
                </button>
              </div>
            </div>
          </div>
          <div
            className={`max-h-40 overflow-hidden transition-all ${expanded ? "w-full" : "w-0 hidden"
              }`}
            style={{ overflowY: "auto" }}
          >
            <div className="px-3 mt-2">
              <div>
                {userInfo.playlist_created?.length > 0 ? (
                  <ListPlaylist />
                ) : (
                  <div className="bg-light30 py-2 px-3 font-medium rounded-md dark:bg-dark30">
                    <span className="text-lightText dark:text-darkText">
                      Create your first playlist
                    </span>
                    <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
                      Personalize your experience at TuneHub
                    </p>
                    <button
                      onClick={openModal}
                      className="bg-light10 dark:bg-dark10 px-5 py-2 my-2 rounded-lg text-white hover:text-slate-950"
                    >
                      Create Playlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-3 text-lightText dark:text-darkText">
            <div className="font-medium text-textSecondary py-2 px-3">
              <div className="flex items-center">
                <FaUser size={22} />
                &nbsp;
                <span
                  className={`overflow-hidden transition-all ${expanded ? "w-52" : "w-0 hidden"
                    }`}
                >
                  Followed Artists
                </span>
              </div>
            </div>
          </div>
          <div
            className={`max-h-40 overflow-hidden transition-all ${expanded ? "w-full" : "w-0 hidden"
              }`}
            style={{ overflowY: "auto" }}
          >
            <div className="px-3 mt-2">
              {!userInfo.artist_followed ||
                userInfo?.artist_followed?.length === 0 ? (
                <div className="bg-light30 py-2 px-3 font-medium rounded-md dark:bg-dark30">
                  <span className="text-lightText dark:text-darkText">
                    Find some artist to follow
                  </span>
                  <p className="text-xs text-lightTextSecondary dark:text-darkTextSecondary">
                    We'll keep you updated on latest release
                  </p>
                  <button className="bg-light10 dark:bg-dark10 px-5 py-2 my-2 rounded-lg text-white hover:text-slate-950">
                    Browse artists
                  </button>
                </div>
              ) : (
                <div className="px-3 text-textSecondary text-sm font-medium cursor-pointer">
                  {userInfo.artist_followed.map((artist) => (
                    <Link
                      to={(`/artist/${artist._id}`)}
                      className="flex items-center mb-3 hover:underline" key={artist._id}>
                      <img
                        className="w-10 h-10 rounded-full object-center object-cover border-slate-600  border-2"
                        src={artist.userId.profile_picture}
                      />
                      &nbsp;
                      <span className="text-lightText dark:text-darkTextSecondary">
                        {artist.artist_name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Modal open={showModal} onClose={closeModal}>
        <Box
          sx={
            {
              /* Thêm CSS cho Modal */
            }
          }
        >
          <div
            className="fixed top-0 left-0 flex items-center z-10000 justify-center w-full h-full bg-black bg-opacity-50 z-100"
            onClick={closeModal}
          >
            <div
              className="relative w-80 bg-white rounded-lg shadow-md z-10 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full px-4 py-2 border border-black-300 rounded-lg focus:outline-none focus:border-primary mb-4"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#333",
                  backgroundColor: "#f7f7f7",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
              <div className="flex justify-center items-center mb-4">
                <label
                  htmlFor="imageInput"
                  className="cursor-pointer bg-primary text-black py-2 px-4 rounded-lg hover:bg-primary-dark flex items-center"
                >
                  <BsFolderPlus size={20} className="mr-2" />
                  <span className="w-44 overflow-x-hidden text-center" id="chooseImageText">
                    Choose Image
                  </span>
                </label>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageInputChange(e)}
                  className="hidden"
                />
              </div>
              <button
                onClick={handleCreatePlaylist}
                className="w-full py-2 text-sm bg-primary text-black font-semibold rounded-lg hover:bg-primary-dark focus:outline-none"
                style={{
                  transition: "background-color 0.3s ease",
                }}
              >
                Create Playlist
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <div className="h-20"></div>
    </div>
  );
}
