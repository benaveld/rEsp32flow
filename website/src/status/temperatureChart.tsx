import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import "chartjs-adapter-luxon";
import {
  Chart as ChartJS,
  ChartOptions,
  ChartData,
  registerables,
} from "chart.js";

ChartJS.register(...registerables);

const TemperatureChart = () => {
  const { history } = useSelector((appState: AppState) => appState.statusState);

  const latestUptime = history.length > 0 ? history[history.length - 1].uptime : 0;
  const agedHistory = history.map((value) => {
    return { ...value, age: latestUptime - value.uptime };
  });

  const data: ChartData<"line", any, unknown> = {
    datasets: [
      {
        label: "Oven",
        data: agedHistory,
        pointRadius: 0,
        pointHitRadius: 0,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        parsing: {
          xAxisKey: "age",
          yAxisKey: "oven",
        },
      },
      {
        label: "Chip",
        data: history,
        pointRadius: 0,
        pointHitRadius: 0,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        parsing: {
          xAxisKey: "age",
          yAxisKey: "chip",
        },
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
        type: "time",
        reverse: true,
        time: {
          unit: "second",
          stepSize: 10,
          round: "second",
          displayFormats: {
            second: "mm:ss",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        ticks: {
          callback: (value) => value + "°C",
        },
        suggestedMin: 0,
        suggestedMax: 200,
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default TemperatureChart;
