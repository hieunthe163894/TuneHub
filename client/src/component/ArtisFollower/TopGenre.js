import React from 'react';
import PerformRequest from "../../utilities/PerformRequest";
import { useState, useRef, useEffect } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export default function App() {
    const [dataSet, setDataSet] = useState([]);
    const [label, setLabels] = useState([]);
    const hasMounted = useRef(false);
    const { OriginalRequest } = PerformRequest();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await OriginalRequest(
                    `artists/getTopGenre`,
                    "GET"
                );
                const genre = response.data.map((i) => i.genre);
                const count = response.data.map((i) => i.stream_count);
                setLabels(genre);
                setDataSet(count);
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

    const data = {
        labels: label,
        datasets: [
            {
                label: 'Top Genre',
                data: dataSet,
                backgroundColor: 'rgba(255, 200, 0, 0.2)',
                borderColor: 'rgba(255, 200, 0, 1)',
                borderWidth: 1,
            },
        ],
    };
    return <Radar data={data} />;
}
