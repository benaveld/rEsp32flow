import {
  Box,
  Button,
  Divider,
  Paper,
  PaperProps,
  Typography,
} from "@mui/material";
import { ProfileStepView } from "../profile/profileStepView";
import { useEStopRelayMutation, useGetRelayStatusQuery } from "./relayApi";
import { selectProfileById, useGetProfilesQuery } from "../profile/profileApi";
import {
  selectNextProfileStep,
  selectProfileStep,
} from "../profile/profileTypes";

export type RelayStatusViewProps = PaperProps;

const NotRunningRelay = (props: RelayStatusViewProps) => (
  <Paper {...props}>
    <Typography noWrap>Not running</Typography>;
  </Paper>
);

const ProfilesAreLoading = (props: RelayStatusViewProps) => (
  <Paper {...props}>
    <Typography>Loading...</Typography>
  </Paper>
);

const RelayStatusView = (props: RelayStatusViewProps) => {
  const [stopRelay] = useEStopRelayMutation();
  const { info } = useGetRelayStatusQuery(undefined, {
    selectFromResult: ({ data }) => ({
      info: data?.info,
    }),
  });

  const { runningProfile, isLoading: isProfileLoading } = useGetProfilesQuery(
    undefined,
    {
      selectFromResult: ({ data, isLoading }) => ({
        isLoading,
        runningProfile:
          info !== undefined
            ? selectProfileById(data, info.profileId)
            : undefined,
      }),
    }
  );

  if (!info) return <NotRunningRelay {...props} />;
  if (!runningProfile) {
    if (isProfileLoading) return <ProfilesAreLoading {...props} />;
    throw new Error("Running Profile ID not found");
  }

  const currentStep = selectProfileStep(runningProfile, info.stepId);
  if (!currentStep) throw new Error("currentStep should not be undefined");

  const nextStep = selectNextProfileStep(runningProfile, info.stepId);
  const relayOnTime = (info.relayOnTime / 1000).toFixed(2);
  const updateRate = info.updateRate / 1000;
  const stepTime = Math.round(info.stepTime / 1000);

  return (
    <Paper {...props}>
      <Typography>Running {runningProfile.name}</Typography>
      <Divider />
      <Typography>Relay on for {relayOnTime}sec</Typography>
      <Typography>Update every {updateRate}sec</Typography>
      <Button onClick={() => stopRelay()}>Stop</Button>
      <Typography>Current step {stepTime}sec</Typography>

      <Divider />
      <ProfileStepView step={currentStep} />

      {nextStep !== undefined && (
        <Box>
          <Divider />
          <Typography>Next step</Typography>
          <ProfileStepView step={nextStep} />
        </Box>
      )}
    </Paper>
  );
};

export default RelayStatusView;
