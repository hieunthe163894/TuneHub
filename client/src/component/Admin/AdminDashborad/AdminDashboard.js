import AdminTemplate from "../../../template/AdminTemplate";
import PerformRequest from "../../../utilities/PerformRequest";
import React, { useEffect, useState, useRef } from "react";
import { TbPigMoney } from "react-icons/tb";
import AdminRevenueRatio from "./AdminRevenueRatio";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import ArtistIncomeStatistic from "./ArtistIncomeStatistic";
import {
  FaMusic,
  FaChartLine,
  FaUsers,
  FaUserPlus,
  FaMedal,
} from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";
import { GoReport } from "react-icons/go";
import AdminTrend from "./AdminTrend";
import TopSongs from "./TopSongs";
import AdminArtistIncomeRatio from "./AdminArtistIncomeRatio";
function AdminDashboard() {
  const hasMounted = useRef(false);
  const [valid, setValid] = useState(false);
  const { OriginalRequest } = PerformRequest();
  const [span, setSpan] = useState("weekly");
  const [dataType, setDataType] = useState("revenue");
  const [statistic, setStatistic] = useState({
    sale: 640000,
    followers: 320,
    streamTime: 2201,
    report: 41
  });

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

  useEffect(() => {
    if (hasMounted.current) {
      checkAdmin();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);
  
  if (valid) {
    return (
      <AdminTemplate>
        <div className="w-full min-h-screen px-5">
          <h3 className="text-lightText dark:text-darkText text-2xl font-semibold pl-3">
            Admin Dashboard
          </h3>
          <div className="w-full h-[1px] bg-black/60 dark:bg-darkText/60 shadow-md mt-2"></div>
          <div className="flex flex-row">
            <button
              onClick={() => handleChange("weekly", "span")}
              className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${span === "weekly"
                ? "border-b-2 border-light10 dark:border-dark10"
                : ""
                }`}
            >
              <span className="cursor-pointer">Weekly</span>
            </button>
            <button
              onClick={() => handleChange("monthly", "span")}
              className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${span === "monthly"
                ? "border-b-2 border-light10 dark:border-dark10"
                : ""
                }`}
            >
              <span className="cursor-pointer">Monthly</span>
            </button>
            <button
              onClick={() => handleChange("allTime", "span")}
              className={`px-3 py-2 font-semibold text-lightText dark:text-darkText m-1 ${span === "allTime"
                ? "border-b-2 border-light10 dark:border-dark10"
                : ""
                }`}
            >
              <span className="cursor-pointer">All time</span>
            </button>
          </div>
          <div className="flex mt-5 w-full justify-between">
            <div className="w-full px-5 py-2 h-48 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
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
                  <div className="flex">
                    <GoReport
                      className="text-lightText dark:text-darkText mr-3"
                      size={35}
                    />
                    <div>
                      <h3 className="text-2xl font-semibold text-lightText dark:text-darkText">
                        {statistic.report}
                      </h3>
                      <h3 className="text-lightTextSecondary dark:text-darkTextSecondary text-xs">
                        new report by user
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <p>loading</p>
              )}
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between items-center">
            <div className="relative w-9/12 mr-1 px-5 flex flex-col justify-between py-2 h-80 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <FormControl
                className="absolute w-36 right-11"
              >
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
              <div className="h-72 w-full">
                <AdminTrend span={span} type={dataType} />
              </div>
            </div>
            <div className="w-3/12 px-5 py-2 h-80 flex flex-col justify-between bg-light5 rounded-md dark:bg-dark30 ml-3 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Revenue ratio
              </h4>
              <AdminRevenueRatio span={span} />
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between items-center">
            <div className="w-9/12 mr-1 px-5 flex flex-col justify-between py-2 h-80 bg-light5 rounded-md dark:bg-dark30 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Most Streamed Songs
              </h4>
              <TopSongs span={span} />
            </div>
            <div className="w-3/12 px-5 py-2 h-80 flex flex-col justify-between bg-light5 rounded-md dark:bg-dark30 ml-3 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
              <h4 className="font-medium text-lightText dark:text-darkText">
                Income Artist ratio
              </h4>
              <AdminArtistIncomeRatio span={span} />
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between items-center px-4 bg-light5 rounded-md dark:bg-dark30 mr-2 shadow-md dark:shadow-blue-700/30 border-2 border-lightTextSecondary/30 dark:border-darkTextSecondary/30">
            <ArtistIncomeStatistic date={span} artistId={'65e29cbf330a617451ea4df7'} />
          </div>
          <div className="h-20"></div>
        </div>
      </AdminTemplate>
    );
  }
}
export default AdminDashboard;
