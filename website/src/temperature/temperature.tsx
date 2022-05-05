import { Dispatch, Fragment, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../state";
import { loadTemperature } from "./state/temperatureActions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
  const ovenTemperature = useSelector(
    (appState: AppState) => appState.temperatureState.oven
  );
  const ovenTemperatureHistory = useSelector(
    (appState: AppState) => appState.temperatureState.ovenHistory
  );
  const chipTemperature = useSelector(
    (appState: AppState) => appState.temperatureState.chip
  );
  const chipTemperatureHistory = useSelector(
    (appState: AppState) => appState.temperatureState.chipHistory
  );
  const errorMessage = useSelector(
    (appState: AppState) => appState.temperatureState.error
  );

  const sampleRate = useSelector(
    (appState: AppState) => appState.temperatureState.historySampleRate
  );

  const options = {
    responsive: true,
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
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Value",
        },
        suggestedMin: 0,
        suggestedMax: 200,
      },
    },
  };

  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    dispatch(loadTemperature(120));
    const interval = setInterval(
      () => dispatch(loadTemperature(1)),
      sampleRate
    );
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, sampleRate]);

  const data = {
    labels: ovenTemperatureHistory.map((value, index, array) =>
      (array.length - index).toString()
    ),
    datasets: [
      {
        label: "Oven",
        data: ovenTemperatureHistory,
        pointStyle: 'cross',
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Chip",
        data: chipTemperatureHistory,
        pointStyle: 'cross',
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Fragment>
      <p>Oven: {ovenTemperature}C</p>
      <p>Chip: {chipTemperature}C</p>
      {errorMessage && <p>{errorMessage}</p>}
      <Line options={options} data={data} />
    </Fragment>
  );
};

export default TemperatureChart;
