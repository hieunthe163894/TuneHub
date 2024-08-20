import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import PerformRequest from "../../utilities/PerformRequest";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function RevenueRatio({span}) {
  const [songRev, setSongRev] = useState(0);
  const [albumRev, setAlbumRev] = useState(0);
  const { OriginalRequest } = PerformRequest();
  const hasMounted = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await OriginalRequest(
        `artists/revenueRatio/${span}`,
        "GET"
      );
      if (response) {
        console.log(response);
        response.data.map((i) => {
          if (i.type === "song") {
            console.log(i.totalRevenue);
            setSongRev(i.totalRevenue);
          } else {
            console.log(i.totalRevenue);
            setAlbumRev(i.totalRevenue);
          }
        });
      }
    };
    if (hasMounted.current) {
      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [span, hasMounted]);
  // const data = [
  //   {
  //     label: "Exclusive tracks",
  //     value: songRev,
  //     color: "rgba(170, 216, 243, 1)",
  //     cutout: "50%",
  //   },
  //   {
  //     label: "Albums",
  //     value: albumRev,
  //     color: "rgba(254, 190, 200, 1)",
  //     cutout: "50%",
  //   },
  // ];

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart can take the full height of the parent container
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
    labels: ["Exclusive tracks", "Albums"],
    datasets: [
      {
        data: [songRev, albumRev],
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
