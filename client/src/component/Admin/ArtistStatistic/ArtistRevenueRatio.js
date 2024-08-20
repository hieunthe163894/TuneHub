import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import PerformRequest from "../../../utilities/PerformRequest";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function ArtistRevenueRatio({span,artistId}) {
  const [tracks, setTracks] = useState(0);
  const [donate, setDonate] = useState(0);
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await OriginalRequest(
        `artists/getArtistRetioIncomeByAdmin/${artistId}/${span}`,
        "GET"
      );
      if (response) {
        setTracks(response.data.tracks)
        setDonate(response.data.donate)
      }
    };
    if (hasMounted.current) {
      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [span, hasMounted]);

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "Revenue ratio",
      },
    },
  };

  const data = {
    labels: ["Tracks", "Donate"],
    datasets: [
      {
        data: [tracks, donate],
        backgroundColor: ["rgba(170, 216, 243, 1)", "rgba(254, 190, 200, 1)"],
        borderColor: ["rgba(170, 216, 243, 1)", "rgba(254, 190, 200, 1)"],
        borderWidth: 1,
        cutout: "50%",
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}
