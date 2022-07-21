import {
  Box,
  Button,
  ButtonProps,
  Paper,
  PaperProps,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { ProfileStepView } from "../profile/profileStepView";
import { useEStopRelayMutation, useGetRelayStatusQuery } from "./relayApi";
import { selectProfileById, useGetProfilesQuery } from "../profile/profileApi";
import { selectRemainingProfileSteps } from "../profile/profileTypes";
import { ArrowDropDown, Stop } from "@mui/icons-material";
import { forwardRef, useMemo } from "react";
import { useGetStatusUpdateQuery } from "../status/statusApi";

export interface RelayStatusViewProps extends PaperProps {
  fractionDigits?: number;
}

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

const NextStepDivider = forwardRef<HTMLDivElement, StackProps>((props, ref) => (
  <Stack ref={ref} direction="row" justifyContent="space-evenly" {...props}>
    <ArrowDropDown />
    <ArrowDropDown />
    <ArrowDropDown />
    <ArrowDropDown />
    <ArrowDropDown />
  </Stack>
));
NextStepDivider.displayName = "NextStepDivider";

const RelayStatusView = (props: RelayStatusViewProps) => {
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
        runningProfile: info
          ? selectProfileById(data, info.profileId)
          : undefined,
      }),
    }
  );
  const { uptime = info?.uptime ?? 0 } = useGetStatusUpdateQuery(undefined, {
    selectFromResult: ({ data }) => ({ uptime: data?.uptime }),
  });

  const currentStepId = info?.stepId;
  const remainingSteps = useMemo(
    () =>
      runningProfile && currentStepId !== undefined
        ? selectRemainingProfileSteps(runningProfile, currentStepId)
        : [],
    [runningProfile, currentStepId]
  );

  if (!info) return <NotRunningRelay {...props} />;
  if (!runningProfile) {
    if (isProfileLoading) return <ProfilesAreLoading {...props} />;
    throw new Error("Running Profile ID not found");
  }

  const { fractionDigits = 2 } = props;
  const msToSec = (value: number) => (value / 1000).toFixed(fractionDigits);

  const relayOnTime = msToSec(info.relayOnTime);
  const updateRate = msToSec(info.updateRate);
  const stepTime = Math.round((info.stepTime + (uptime - info.uptime)) / 1000);

  return (
    <Paper sx={{ padding: "8px" }} {...props}>
      <Box sx={{ display: "flex", flexDirection: "row", padding: "8px" }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {runningProfile.name}
        </Typography>

        <EStopButton>EStop</EStopButton>
      </Box>

      <Typography>
        Relay on for {relayOnTime} / {updateRate}sec
      </Typography>
      <Typography>Current step {stepTime}sec</Typography>

      <Stack divider={<NextStepDivider />}>
        {remainingSteps.map((step) => (
          <ProfileStepView key={step.id} elevation={2} step={step} />
        ))}
      </Stack>
    </Paper>
  );
};

export default RelayStatusView;

export const EStopButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const [stopRelay] = useEStopRelayMutation();
    return (
      <Button
        ref={ref}
        variant="contained"
        onClick={() => stopRelay()}
        endIcon={<Stop />}
        color="error"
        title="Emergency stop"
        {...props}
      />
    );
  }
);
EStopButton.displayName = "EStopButton";
