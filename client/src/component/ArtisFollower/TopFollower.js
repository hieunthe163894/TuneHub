import React from 'react';
import PerformRequest from "../../utilities/PerformRequest";
import { useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function Follower() {
  const [dataSet, setDataSet] = useState([]);
  const [labels, setLabels] = useState([]);
  const hasMounted = useRef(false);
  const { OriginalRequest } = PerformRequest();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await OriginalRequest(
          `artists/getCountFollower`,
          "GET"
        );
        const data = response.data;
        console.log(data);
        if (data.length === 0) {
          setLabels([]);
          setDataSet([]);
        } else {
          const createdAt = data.map(item => item.createdAt);
          const date = data.map(item => item.date);
          console.log(createdAt);
          const startDate = createdAt[0];
          const endDate = date[0];
          // setLabels(generateLabels(startDate, endDate));
          setLabels(["10/9", "11/9", "12/9", "13/9", "14/9", "15/9", "16/9", "17/9", "18/9", "19/9", "20/9", "21/9"])
          const dataSetArray = generateDataSet(data, labels);
          setDataSet(dataSetArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (hasMounted.current) {
      fetchData();
    } else {
      hasMounted.current = true;
    }
  }, [hasMounted]);

  const generateDataSet = (data, labels) => {
    const dataSetArray = [];

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      const matchingData = data.find(item => {
        const itemDate = `${new Date(item.date).getFullYear()}/${(new Date(item.date).getMonth() + 1).toString().padStart(2, '0')}`;
        return itemDate === label;
      });
      if (matchingData) {
        dataSetArray.push(matchingData.totalFollowers);
      } else {
        dataSetArray.push(0);
      }
    }

    return dataSetArray;
  };


  const generateLabels = (startDate, endDate) => {
    const labels = [];
    let currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate <= endDateTime) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      labels.push(`${year}/${month.toString().padStart(2, '0')}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return labels;
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
        }
      },
      y: {
        title: {
          display: true,
        },
        type: 'linear',
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'User',
        data: [1, 12, 18, 20, 5, 9, 8, 20, 21, 22, 30, 35],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      },
    ],
  };
  return <Line options={options} data={data} />;
}
