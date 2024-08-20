import React from 'react';
import PerformRequest from "../../utilities/PerformRequest";
import { useState, useRef, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BoardSong() {
    const [label, setLabels] = useState([]);
    const [labelStream, setLabelStream] = useState([]);
    const [labelFavourite, setLabelFavourite] = useState([]);
    const [labelPurchase, setLabelPurchase] = useState([]);
    const hasMounted = useRef(false);
    const { OriginalRequest } = PerformRequest();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await OriginalRequest(
                    `artists/getStreamFavouritePurchase`,
                    "GET"
                );
                const songName = response.data.map((i) => i.song_name);
                const stream = response.data.map((i) => i.stream_count);
                const favourite = response.data.map((i) => i.favourite_count);
                const purchase = response.data.map((i) => i.purchased_count);
                setLabels(songName);
                setLabelStream(stream);
                setLabelFavourite(favourite);
                setLabelPurchase(purchase);
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
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
            },
        },
    };

    const data = {
        labels : label,
        datasets: [
            {
                label: 'Stream',
                data: labelStream,
                borderColor: 'rgba(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Favorite',
                data: labelFavourite,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Purchase',
                data: labelPurchase,
                backgroundColor: 'rgba(150, 100, 255, 0.5)',
            },
        ],
    };

    return <Bar options={options} data={data} />;
}
