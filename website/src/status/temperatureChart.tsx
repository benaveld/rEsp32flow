import { ChartProps, Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { Chart as ChartJS, registerables } from "chart.js";
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
  const agedHistory = history.map((value) => ({
    ...value,
    age: latestUptime - value.uptime,
  }));

  type LineProps = ChartProps<"line", typeof agedHistory>;

  const commonDataProps: LineProps["data"]["datasets"][number] = {
    data: agedHistory,
    pointRadius: 0,
    pointHitRadius: 0,
  };

  const data: LineProps["data"] = {
    datasets: [
      {
        ...commonDataProps,
        label: "Oven",
        borderColor: palette.primary.main,
        backgroundColor: palette.primary.light,
        parsing: {
          xAxisKey: "age",
          yAxisKey: "oven",
        },
      },
      {
        ...commonDataProps,
        label: "Chip",
        borderColor: palette.secondary.main,
        backgroundColor: palette.secondary.light,
        parsing: {
          xAxisKey: "age",
          yAxisKey: "chip",
        },
      },
    ],
  };

  const options: LineProps["options"] = {
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

  return (
    <Line
      options={options}
      data={data}
      style={{
        backgroundColor: palette.background.default,
      }}
    />
  );
};

export default TemperatureChart;
