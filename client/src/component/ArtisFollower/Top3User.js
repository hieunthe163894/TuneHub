import React, { useState, useRef, useEffect } from 'react';
import PerformRequest from "../../utilities/PerformRequest";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Top3User() {
    const [dataSet, setDataSet] = useState([]);
    const [labels, setLabels] = useState([]);
    const hasMounted = useRef(false);
    const { OriginalRequest } = PerformRequest();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await OriginalRequest(
                    `artists/getTopDonateUser`,
                    "GET"
                );
                const amounts = response.data.map((i) => i.totalAmount);
                const users = response.data.map((i) => `${i.first_name} ${i.last_name}`);
                setLabels(users);
                setDataSet(amounts);
            } catch (error) {
                console.log(error);
            }
        };

        if (hasMounted.current) {
            fetchData();
        } else {
            hasMounted.current = true;
        }
    }, [hasMounted]);

    const options = {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 3,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
            },
        },
    };

    const data = {
        labels: ['Amount'],
        datasets: [
            {
                label: labels.length > 0 ? labels[0] : '',
                data: dataSet.length > 0 ? [dataSet[0]] : [],
                borderColor: 'rgb(30, 144, 255)',
                backgroundColor: 'rgba(30, 144, 255, 0.5)',
            },
            {
                label: labels.length > 1 ? labels[1] : '',
                data: dataSet.length > 1 ? [dataSet[1]] : [],
                borderColor: 'rgb(0, 205, 118)',
                backgroundColor: 'rgba(0, 205, 118, 0.5)',
            },
            {
                label: labels.length > 2 ? labels[2] : '',
                data: dataSet.length > 2 ? [dataSet[2]] : [],
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
            },
        ],
    };

    return (
        <Bar options={options} data={data} />
    );
}
