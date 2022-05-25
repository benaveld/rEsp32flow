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
  ChartData,
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
  const { history } = useSelector((appState: AppState) => appState.statusState);

  const historyKeys = [...history.keys()];
  const historyValues = [...history.values()];
  const latestKey = historyKeys[historyKeys.length - 1];

  const data: ChartData<"line", number[], unknown> = {
    labels: historyKeys.map((value) => {
      const timeDiff = latestKey - value;
      const totalSeconds = Math.round(timeDiff / 10 ** 3); // milliseconds to seconds
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = (totalSeconds % 60).toString().padStart(2, "0");
      return minutes + ":" + seconds;
    }),
    datasets: [
      {
        label: "Oven",
        data: historyValues.map((value) => value.oven),
        pointRadius: 0,
        pointHitRadius: 0,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Chip",
        data: historyValues.map((value) => value.chip),
        pointRadius: 0,
        pointHitRadius: 0,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

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

  return <Line options={options} data={data} />;
};

export default TemperatureChart;
