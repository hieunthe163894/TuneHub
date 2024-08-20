import { useState, useRef, useEffect } from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js/auto";
import PerformRequest from "../../utilities/PerformRequest";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function Trend({span, type}) {
  const [dataSet, setDataSet] = useState([]);
  const [labels, setLabels] = useState([]);
  const hasMounted = useRef(false);
  const { OriginalRequest } = PerformRequest();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OriginalRequest(
          `artists/getTrend?span=${span}&type=${type}`,
          "GET"
        );
        console.log(response.data);
        const dates = response.data.map((i) => moment(i.date).format(span === "allTime" ? "YYYY/MM": "DD/MM"));
        const totalAmounts = response.data.map((i) => i.totalAmount);
        setLabels(dates);
        setDataSet(totalAmounts);
      } catch (error) {
        console.log(error);
      }
    };
    if (hasMounted.current) {
      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted, span, type]);
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the chart can take the full height of the parent container
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Revenue",
        data: dataSet,
        tension: 0.4,
        fill: true,
        borderColor: "rgb(242, 120, 92)",
        backgroundColor: "rgba(242, 120, 92, 0.5)",
      },
    ],
  };
  return (
    <div className="w-11/12 h-full">
      {dataSet.length > 0 ? (
        <Line
          options={options}
          data={data}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
