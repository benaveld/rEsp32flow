import { ChartProps, Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { Chart as ChartJS, registerables } from "chart.js";
import { PaletteColor, useTheme } from "@mui/material";
import {
  selectEntireHistory,
  TemperatureHistorySlice,
  useGetTemperatureHistoryQuery,
} from "./statusApi";
import { useAppColor } from "../hooks";

ChartJS.register(...registerables);

interface AgedHistorySlice extends TemperatureHistorySlice {
  age: number;
}
type LineProps = ChartProps<"line", AgedHistorySlice[]>;

interface getDatasetPropsProps {
  paletteColor: PaletteColor;
  yAxisKey: Exclude<keyof AgedHistorySlice, "age" | "uptime">;
}

const getDatasetProps = ({
  paletteColor,
  yAxisKey,
}: getDatasetPropsProps): Partial<LineProps["data"]["datasets"][number]> => ({
  pointRadius: 0,
  pointHitRadius: 0,
  borderColor: paletteColor.main,
  backgroundColor: paletteColor.light,
  parsing: {
    xAxisKey: "age",
    yAxisKey: yAxisKey,
  },
});

const TemperatureChart = () => {
  const { history } = useGetTemperatureHistoryQuery(undefined, {
    selectFromResult: ({ data }) => ({ history: selectEntireHistory(data) }),
  });
  const { palette } = useTheme();

  const ovenDatasetProps = getDatasetProps({
    paletteColor: useAppColor("oven"),
    yAxisKey: "oven",
  });
  const chipDatasetProps = getDatasetProps({
    paletteColor: useAppColor("chip"),
    yAxisKey: "chip",
  });

  const latestReceivedUptime =
    history.length > 0 ? history[history.length - 1].uptime : 0;
  const agedHistory: AgedHistorySlice[] = history.map((value) => ({
    ...value,
    age: latestReceivedUptime - value.uptime,
  }));

  const data: LineProps["data"] = {
    datasets: [
      {
        ...ovenDatasetProps,
        data: agedHistory,
      },
      {
        ...chipDatasetProps,
        data: agedHistory,
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
