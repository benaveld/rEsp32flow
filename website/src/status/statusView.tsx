import { Box, BoxProps, Button, Card, Typography } from "@mui/material";
import { useAppSelector } from "../hooks";
import { ProfileStepView } from "../profile/profileStepView";
import { stopRelay } from "../relay/relayActions";

const ColoredBox = (props: { color: string } & BoxProps) => {
  const { color, sx, ...other } = props;
  return (
    <Box
      sx={{
        backgroundColor: color,
        width: "0.8em",
        height: "0.8em",
        marginTop: "auto",
        marginBottom: "auto",
        marginRight: "0.1em",
        marginLeft: "0.1em",
        ...sx,
      }}
      {...other}
    />
  );
};

export default function StatusView(props: BoxProps) {
  const status = useAppSelector((appState) => appState.statusState);
  const { profiles } = useAppSelector((appState) => appState.profileState);
  const runningProfile = status.isOn ? profiles[status.profileId] : undefined;

  return (
    <Box {...props}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <ColoredBox color="primary.main" />
        <Typography noWrap>Oven: {status.oven.toFixed(2)}°C</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <ColoredBox color="secondary.main" />
        <Typography noWrap>Chip: {status.chip.toFixed(2)}°C</Typography>
      </Box>

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
          <Typography color="error">Sensor fault: {status.fault}</Typography>
          {status.faultText.map((value, index) => (
            <Typography key={index} color="error">
              {value}
            </Typography>
          ))}
        </Card>
      )}

      {status.error !== undefined && (
        <Typography color="error">{status.error}</Typography>
      )}
    </Box>
  );
}
