import { Box, Button, Card, CardProps, Typography } from "@mui/material";
import { ProfileStepView } from "../profile/profileStepView";
import { useGetStatusUpdateQuery } from "../status/statusApi";
import { stopRelay } from "./relayActions";
import { selectProfileById, useGetProfilesQuery } from "../profile/profileApi";

const RelayStatusView = (props: CardProps) => {
  //TODO use websocket
  const { data: status } = useGetStatusUpdateQuery();

  const { data: profileState } = useGetProfilesQuery();
  const runningProfile = status?.isOn
    ? selectProfileById(profileState, status.profileId)
    : undefined;

  if (status && runningProfile) {
    return (
      <Card {...props}>
        <Typography>Running {runningProfile.name}</Typography>
        <Typography>Relay on for {status.relayOnTime / 1000}sec</Typography>
        <Typography>Update every {status.updateRate / 1000}sec</Typography>
        <Button onClick={stopRelay}>Stop</Button>
        <Typography>
          Current step {Math.round(status.stepTime / 1000)}sec
        </Typography>
        <ProfileStepView step={runningProfile.steps[status.profileStepId]} />
        {runningProfile.steps.length > status.profileStepId + 1 && (
          <Box>
            <Typography>Next step</Typography>
            <ProfileStepView
              step={runningProfile.steps[status.profileStepId + 1]}
            />
          </Box>
        )}
      </Card>
    );
  } else return <Typography noWrap>Not running</Typography>;
};

export default RelayStatusView;
