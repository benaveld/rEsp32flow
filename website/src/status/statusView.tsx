import { Box, Card, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../state";
import { updateStatus } from "./state/statusActions";

export default function StatusView() {
  const ovenTemperature = useSelector(
    (appState: AppState) => appState.statusState.oven
  );
  const chipTemperature = useSelector(
    (appState: AppState) => appState.statusState.chip
  );
  const isOn = useSelector((appState: AppState) => appState.statusState.isOn);
  const sensorFault = useSelector(
    (appState: AppState) => appState.statusState.fault
  );
  const errorMessage = useSelector(
    (appState: AppState) => appState.statusState.error
  );

  const isLoading = useSelector(
    (appState: AppState) => appState.statusState.loading
  );

  const dispatch: Dispatch<any> = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) dispatch(updateStatus());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, isLoading]);

  return (
    <Box>
      <Typography>Oven: {ovenTemperature}</Typography>
      <Typography>Chip: {chipTemperature}</Typography>
      <Typography>IsOn: {isOn ? "true" : "false"}</Typography>

      {sensorFault !== 0 && (
        <Card>
          <Typography>Sensor fault: {sensorFault}</Typography>
        </Card>
      )}

      {errorMessage !== undefined && (
        <Card>
          <Typography>{errorMessage}</Typography>
        </Card>
      )}
    </Box>
  );
}
