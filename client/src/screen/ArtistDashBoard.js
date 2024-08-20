import SongList from "../component/SongList";
import ArtistTemplate from "../template/ArtistTemplate";
import { AiOutlineEllipsis } from "react-icons/ai";
import { TbPigMoney } from "react-icons/tb";
import { FaUserPlus, FaMedal } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import RevenueRatio from "../component/ArtistDashBoard/RevenueRatio";
import Top5Tracks from "../component/ArtistDashBoard/Top5Tracks";
import TrackPerfomance from "../component/ArtistDashBoard/TrackPerformance";
import PerformRequest from "../utilities/PerformRequest";
import Trend from "../component/ArtistDashBoard/Trend";

export default function ArtistDashBoard() {
  const [span, setSpan] = useState("weekly");
  const [dataType, setDataType] = useState("revenue");
  const hasMounted = useRef(false);
  const { OriginalRequest } = PerformRequest();
  const [statistic, setStatistic] = useState(null);
  const [valid, setValid] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [bestSeller, setBestSeller] = useState(null)
  const checkArtist = async () => {
    const response = await OriginalRequest(`auth/checkArtist`, "GET");
    if (response) {
      setValid(true);
      fetchImage();
      fetchStatistic();
    }
  };

  const fetchImage = async () => {
    const data = await OriginalRequest(
      `songs/getArtistSongIncome/${span}/revenue/${userInfo._id}`,
      "GET"
    );
    if (data) {
      setBestSeller(data.data[0]);
    }
  };

  const fetchStatistic = async () => {
    const response = await OriginalRequest(
      `artists/getStatistic/${span}`,
      "GET"
    );
    if (response) {
      setStatistic(response.data);
    }
  };

  useEffect(() => {
    try {
      if (hasMounted.current) {
        checkArtist();
      } else {
        hasMounted.current = true;
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [hasMounted, span]);

  useEffect(() => {
    fetchStatistic();
  }, []);
  if (valid) {
    return (
      <ArtistTemplate>
        <div className="w-full min-h-screen px-5">
          <div className="flex justify-between items-center mt-5">
            <h1 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
              Artist DashBoard
            </h1>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Time Span</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={span}
                label="TimeSpan"
                onChange={(e) => {
                  setSpan(e.target.value);
                }}
              >
                <MenuItem value={"weekly"}>Weekly</MenuItem>
                <MenuItem value={"monthly"}>Monthly</MenuItem>
                <MenuItem value={"allTime"}>All Time</MenuItem>
              </Select>
            </FormControl>
            {/* <AiOutlineEllipsis
            className="text-lightText dark:text-darkText mr-3"
            size={30}
          /> */}
          </div>
          <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
          <div className="flex mt-5 w-full justify-between">
            <div className="w-10/12 px-5 py-2 h-48 bg-light5 rounded-md dark:bg-dark30 mr-2 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h2 className="text-lightText dark:text-darkText text-xl font-semibold mb-10">
                {span.charAt(0).toUpperCase() + span.slice(1)} Statistic
              </h2>
              {statistic ? (
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <TbPigMoney
                      className="text-lightText dark:text-darkText mr-3"
                      size={35}
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-lightText dark:text-darkText">
                        {Intl.NumberFormat("de-DE").format(statistic.sale)} đ
                      </h3>
                      <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-xs">
                        album and exclusive tracks sale
                      </h3>
                    </div>
                  </div>
                  <div className="flex">
                    <FaUserPlus
                      className="text-lightText dark:text-darkText mr-3"
                      size={35}
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-lightText dark:text-darkText">
                        {statistic.followers}
                      </h3>
                      <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-xs">
                        new followers
                      </h3>
                    </div>
                  </div>
                  <div className="flex">
                    <FaHeadphones
                      className="text-lightText dark:text-darkText mr-3"
                      size={35}
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-lightText dark:text-darkText">
                        {statistic.streamTime}
                      </h3>
                      <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-xs">
                        total stream times
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <p>loading</p>
              )}
            </div>
            <div
              className="w-2/12 relative p-2 rounded-md flex items-end h-48 shadow-lg dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30"
              style={{
                backgroundImage: `url('${bestSeller?.cover_image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 rounded-md px-2"></div>
              <div className="opacity-100 text-lg z-10 ">
                <div className="text-yellow-600 opacity-100 font-medium text-lg z-10 flex items-center">
                  <h4 className="">Best Seller &nbsp;</h4>
                  <FaMedal />
                </div>
                <Link to={"/"}>
                  <h5 className="text-darkText opacity-100 text-sm z-10 overflow-ellipsis line-clamp-1">
                  {bestSeller?.song_name}
                  </h5>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full mt-3 p-5 max-w-full bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
            <FormControl>
              <InputLabel id="demo-simple-select-label">Data</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataType}
                label="Data"
                onChange={(e) => {
                  setDataType(e.target.value);
                }}
              >
                <MenuItem value={"revenue"}>Revenue</MenuItem>
                <MenuItem value={"streams"}>Stream time</MenuItem>
              </Select>
            </FormControl>
            <div className="h-96 w-full">
              <Trend span={span} type={dataType} />
            </div>
          </div>
          <div className="w-full mt-3 flex justify-between items-center">
            <div className="w-3/12 px-5 py-2 h-80 flex flex-col justify-between bg-light5 rounded-md dark:bg-dark30 mr-2 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Revenue ratio
              </h4>
              <RevenueRatio span={span} />
            </div>
            <div className="w-9/12 px-5 py-2 h-80 flex flex-col justify-between bg-light5 rounded-md dark:bg-dark30 mr-2 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Most Streamed Songs
              </h4>
              <Top5Tracks span={span} />
            </div>
          </div>
          <div className="mt-3 w-full px-5 py-2 h-96 bg-light5 rounded-md dark:bg-dark30 mr-2 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
            <TrackPerfomance date={span}/>
          </div>
          <div className="h-20"></div>
        </div>
      </ArtistTemplate>
    );
  }
}
