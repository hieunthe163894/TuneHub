import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import PerformRequest from "../../../utilities/PerformRequest";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);
export default function TopSongs({ span }) {
  const [songNames, setSongNames] = useState([]);
  const [streamCount, setStreamCount] = useState([]);
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  const artistId = '65e29cbf330a617451ea4df7'
  useEffect(() => {
    const fetchData = async () => {
      if (!artistId) {
        const response = await OriginalRequest(
          `artists/mostStreamed/${span}`,
          "GET"
        );
        if (response) {
          const names = response.data.map((i) => i.songDetail.song_name);
          const count = response.data.map((i) => i.streamCount);
          console.log(names);
          setSongNames(names);
          console.log(streamCount);
          setStreamCount(count);
        }
      } else {
        const response = await OriginalRequest(
          `artists/mostArtistStreamedByAdmin/${span}/${artistId}`,
          "GET"
        );
        if (response) {
          const names = response.data.map((i) => i.songDetail.song_name);
          const count = response.data.map((i) => i.streamCount);
          console.log(names);
          setSongNames(names);
          console.log(streamCount);
          setStreamCount(count);
        }
      }
    };
    if (hasMounted.current) {
      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [span, hasMounted]);
  const data = {
    labels: songNames,
    datasets: [
      {
        label: "Most streamed songs",
        backgroundColor: [
          "rgba(255, 193, 205, 0.5)",
          "rgba(252, 218, 184, 0.5)",
          "rgba(255, 223, 155, 0.5)",
          "rgba(174, 242, 242, 0.5)",
          "rgba(205, 178, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 193, 205, 1)",
          "rgba(252, 218, 184, 1)",
          "rgba(255, 223, 155, 1)",
          "rgba(174, 242, 242, 1)",
          "rgba(205, 178, 255, 1)",
        ],
        borderWidth: 1,
        data: streamCount,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart can take the full height of the parent container
    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
      title: {
        display: false,
        text: "Top Streamed tracks",
      },
    },
    scales: {
      //   x: {
      //     ticks: {
      //       color: "#0000FF", // Change X-axis labels text color
      //     },
      //   },
      y: {
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
  };

  return (
    <div className="w-11/12 h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
