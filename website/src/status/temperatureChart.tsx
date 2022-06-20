import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import {
  Chart as ChartJS,
  ChartOptions,
  ChartData,
  registerables,
} from "chart.js";
import { useTheme } from "@mui/material";
import { historySelector, useGetTemperatureHistoryQuery } from "./statusApi";

ChartJS.register(...registerables);

const TemperatureChart = () => {
  const { data: fetchedData } = useGetTemperatureHistoryQuery();
  const { palette } = useTheme();

  const history = fetchedData ? historySelector.selectAll(fetchedData) : [];

  const latestUptime =
    history.length > 0 ? history[history.length - 1].uptime : 0;
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
        borderColor: palette.primary.main,
        backgroundColor: palette.primary.light,
        parsing: {
          xAxisKey: "age",
          yAxisKey: "oven",
        },
      },
      {
        label: "Chip",
        data: agedHistory,
        pointRadius: 0,
        pointHitRadius: 0,
        borderColor: palette.secondary.main,
        backgroundColor: palette.secondary.light,
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
        display: false,
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
