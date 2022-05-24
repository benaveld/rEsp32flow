import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureChart = () => {
  const { oven, chip } = useSelector(
    (appState: AppState) => appState.statusState
  );

  const [ovenTemperatureHistory, setOvenTemperatureHistory] = useState([oven]);
  const [chipTemperatureHistory, setChipTemperatureHistory] = useState([chip]);

  useEffect(() => {
    setOvenTemperatureHistory((old) => [...old, oven]);
    setChipTemperatureHistory((old) => [...old, chip]);
  }, [oven, chip]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "°C",
        },
        suggestedMin: 0,
        suggestedMax: 200,
      },
    },
  };

  const data = {
    labels: ovenTemperatureHistory.map((_, index, array) => {
      const totalSeconds: number = array.length - index;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return minutes + ":" + seconds.toString().padStart(2, "0");
    }),
    datasets: [
      {
        label: "Oven",
        data: ovenTemperatureHistory,
        pointStyle: "cross",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Chip",
        data: chipTemperatureHistory,
        pointStyle: "cross",
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default TemperatureChart;
