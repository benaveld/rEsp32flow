import { Box, BoxProps, Button, Card, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ProfileStepView } from "../profile/profileStepView";
import { stopRelay } from "../relay/relayActions";
import { AppState } from "../state";
import { updateStatus } from "./state/statusActions";

export default function StatusView(props: BoxProps) {
  const status = useSelector((appState: AppState) => appState.statusState);
  const { profiles } = useSelector(
    (appState: AppState) => appState.profileState
  );

  const runningProfile = status.isOn ? profiles[status.profileId] : undefined;

  const dispatch: Dispatch<any> = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      if (!status.loading) dispatch(updateStatus());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, status.loading]);

  return (
    <Box {...props}>
      <Typography noWrap>Oven: {status.oven.toFixed(2)}</Typography>
      <Typography noWrap>Chip: {status.chip.toFixed(2)}</Typography>

      {status.isOn && runningProfile !== undefined ? (
        <Card>
          <Typography>Running {runningProfile!.name}</Typography>
          <Typography>Relay on for {status.relayOnTime / 1000}sec</Typography>
          <Typography>Update every {status.updateRate / 1000}sec</Typography>
          <Button onClick={stopRelay}>Stop</Button>
          <Typography>
            Current step {Math.round(status.stepTime / 1000)}sec
          </Typography>
          <ProfileStepView
            index={status.profileStepIndex}
            step={runningProfile!.steps[status.profileStepIndex]}
          />
          {runningProfile!.steps.length > status.profileStepIndex + 1 && (
            <Box>
              <Typography>Next step</Typography>
              <ProfileStepView
                index={status.profileStepIndex + 1}
                step={runningProfile!.steps[status.profileStepIndex + 1]}
              />
            </Box>
          )}
        </Card>
      ) : (
        <Typography noWrap>Not running</Typography>
      )}

      {status.fault !== 0 && (
        <Card>
          <Typography>Sensor fault: {status.fault}</Typography>
          {status.faultText.map((value, index) => (
            <Typography key={index}>{value}</Typography>
          ))}
        </Card>
      )}

      {status.error !== undefined && (
        <Card>
          <Typography>{status.error}</Typography>
        </Card>
      )}
    </Box>
  );
}
