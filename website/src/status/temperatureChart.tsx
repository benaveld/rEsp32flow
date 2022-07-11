import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import {
  Chart as ChartJS,
  ChartOptions,
  ChartData,
  registerables,
} from "chart.js";
import { useTheme } from "@mui/material";
import {
  selectEntireHistory,
  useGetTemperatureHistoryQuery,
} from "./statusApi";

ChartJS.register(...registerables);

const TemperatureChart = () => {
  const { history } = useGetTemperatureHistoryQuery(undefined, {
    selectFromResult: ({ data }) => ({ history: selectEntireHistory(data) }),
  });
  const { palette } = useTheme();

  const latestUptime =
    history.length > 0 ? history[history.length - 1].uptime : 0;
  const agedHistory = history.map((value) => {
    return { ...value, age: latestUptime - value.uptime };
  });

  const data: ChartData<"line", typeof agedHistory> = {
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
        ticks: {
          color: palette.text.primary,
        },
      },
      y: {
        display: true,
        ticks: {
          color: palette.text.primary,
          callback: (value) => value + "°C",
        },
        suggestedMin: 0,
        suggestedMax: 200,
        grid: {
          color: palette.text.secondary,
        },
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default TemperatureChart;
