import { Button, Card, CardProps, Typography } from "@mui/material";
import { ProfileStepView } from "../profile/profileStepView";
import { useEStopRelayMutation, useGetRelayStatusQuery } from "./relayApi";
import { selectProfileById, useGetProfilesQuery } from "../profile/profileApi";
import { selectProfileStep } from "../profile/profileTypes";

const RelayStatusView = (props: CardProps) => {
  const [stopRelay] = useEStopRelayMutation();
  const { info } = useGetRelayStatusQuery(undefined, {
    selectFromResult: ({ data }) => ({ info: data?.info }),
  });

  const { runningProfile } = useGetProfilesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      runningProfile: info
        ? selectProfileById(data, info.profileId)
        : undefined,
    }),
  });

  const currentStep = selectProfileStep(runningProfile, info?.stepId);

  if (info && runningProfile) {
    return (
      <Card {...props}>
        <Typography>Running {runningProfile.name}</Typography>
        <Typography>
          Relay on for {(info.relayOnTime / 1000).toFixed(2)}sec
        </Typography>
        <Typography>Update every {info.updateRate / 1000}sec</Typography>
        <Button onClick={() => stopRelay()}>Stop</Button>
        <Typography>
          Current step {Math.round(info.stepTime / 1000)}sec
        </Typography>
        <ProfileStepView step={currentStep!} />
        {/* {runningProfile.steps.length > info.profileStepId + 1 && (
          <Box>
            <Typography>Next step</Typography>
            <ProfileStepView
              step={runningProfile.steps[info.profileStepId + 1]}
            />
          </Box>
        )} */}
      </Card>
    );
  } else return <Typography noWrap>Not running</Typography>;
};

export default RelayStatusView;
