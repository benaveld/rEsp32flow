import { Box, Button, Card, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ProfileStepView } from "../profile/profileStepView";
import { stopRelay } from "../relay/relayActions";
import { AppState } from "../state";
import { updateStatus } from "./state/statusActions";

export default function StatusView() {
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
    <Box sx={{ maxWidth: "30ch" }}>
      <Typography>Oven: {status.oven}</Typography>
      <Typography>Chip: {status.chip}</Typography>

      {status.isOn && runningProfile !== undefined ? (
        <Card>
          <Typography>Running {runningProfile!.name}</Typography>
          <Button onClick={stopRelay}>Stop</Button>
          <Typography>Current step</Typography>
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
        <Typography>Not running</Typography>
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
