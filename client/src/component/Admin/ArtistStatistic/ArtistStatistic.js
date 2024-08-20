import AdminTemplate from "../../../template/AdminTemplate";
import React, { useEffect, useState, useRef } from "react";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Slider,
} from "@mui/material";
import Select from "@mui/material/Select";
import {
  FaMusic,
  FaChartLine,
  FaUsers,
  FaUserPlus,
  FaMedal,
} from "react-icons/fa";
import Top5Tracks from "../../ArtistDashBoard/Top5Tracks";
import ArtistRevenueRatio from "./ArtistRevenueRatio";
import TrackStatistic from "./TrackStatistic";
import PerformRequest from "../../../utilities/PerformRequest";
import { TbPigMoney } from "react-icons/tb";
import { FaHeadphones } from "react-icons/fa6";
function ArtistStatistic() {
  const { OriginalRequest } = PerformRequest();
  const [span, setSpan] = useState("weekly");
  const [statistic, setStatistic] = useState(null);
  const [allArtist, setAllArtist] = useState([]);
  const [artistId, setArtistId] = useState("65e29cbf330a617451ea4df7");
  const hasMouted = useRef(false);
  const [valid, setValid] = useState(false);

  const checkAdmin = async () => {
    const response = await OriginalRequest(`auth/checkAdmin`, "GET");
    if (response) {
      setValid(true);
    }
  };

  const handleChange = (value, type) => {
    if (type === "span") {
      setSpan(value);
    }
  };
  const fetchStatistic = async () => {
    const response = await OriginalRequest(
      `artists/getArtistStatisticByAdmin/${artistId}/${span}`,
      "GET"
    );
    console.log(response);
    if (response) {
      setStatistic(response.data);
    }
  };

  const fetchAllArtist = async () => {
    const response = await OriginalRequest(`artists/getAllArtistLable`, "GET");
    if (response) {
      setAllArtist(response.data);
    }
  };

  useEffect(() => {
    fetchStatistic();
    fetchAllArtist();
  }, []);

  const checkAdminHandle = async () => {
    await checkAdmin();
    console.log("dmm thang cho:", valid);
    if (valid) {
      fetchStatistic();
      fetchAllArtist();
    }
  };

  useEffect(() => {
    if (hasMouted.current) {
      checkAdminHandle();
    } else {
      hasMouted.current = true;
    }
  }, [span, artistId, hasMouted]);

  const handleArtistChange = (event, value) => {
    setArtistId(value ? value.value : null);
  };
  if (valid) {
    return (
      <AdminTemplate>
        <div className="w-full min-h-screen px-5">
          <h3 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
            Artist Statistics
          </h3>
          <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
          <div className="flex flex-row">
            <button
              onClick={() => handleChange("weekly", "span")}
              className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
                span === "weekly"
                  ? "border-b-2 border-light10 dark:border-dark10"
                  : ""
              }`}
            >
              <span className="cursor-pointer">Weekly</span>
            </button>
            <button
              onClick={() => handleChange("monthly", "span")}
              className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
                span === "monthly"
                  ? "border-b-2 border-light10 dark:border-dark10"
                  : ""
              }`}
            >
              <span className="cursor-pointer">Monthly</span>
            </button>
            <button
              onClick={() => handleChange("allTime", "span")}
              className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${
                span === "allTime"
                  ? "border-b-2 border-light10 dark:border-dark10"
                  : ""
              }`}
            >
              <span className="cursor-pointer">All time</span>
            </button>
            <div className="flex-grow"></div>{" "}
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={allArtist}
              className="font-normal w-1/6 mt-2 text-lightText dark:text-darkText rounded-md bg-slate-100 dark:bg-slate-600"
              renderInput={(params) => <TextField {...params} label="Artist" />}
              onChange={handleArtistChange}
            />
          </div>
          <div className="flex mt-3 w-full justify-between">
            <div className="w-10/12 px-5 py-2 h-48 bg-light5 rounded-md dark:bg-dark30 mr-3 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h2 className="font-medium text-lightText dark:text-darkText mb-10">
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
              className="w-2/12 relative p-1 rounded-md flex items-end h-48 shadow-lg dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30"
              style={{
                backgroundImage: `url(${statistic?.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          <div className="w-full mt-4 flex justify-between items-center">
            <div className="w-9/12 px-5 flex flex-col justify-between py-2 h-80 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Most Streamed Songs
              </h4>
              <Top5Tracks span={span} artistId={artistId} />
            </div>
            <div className="w-3/12 px-5 py-2 h-80 flex flex-col justify-between bg-light5 rounded-md dark:bg-dark30 ml-3 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Revenue ratio
              </h4>
              <ArtistRevenueRatio span={span} artistId={artistId} />
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between items-center px-4 bg-light5 rounded-md dark:bg-dark30 mr-2 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
            <TrackStatistic date={span} artistId={artistId} />
          </div>
          <div className="h-20"></div>
        </div>
      </AdminTemplate>
    );
  }
}

export default ArtistStatistic;
