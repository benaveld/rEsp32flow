import { Box, BoxProps, Card, Typography } from "@mui/material";
import { getErrorMessage } from "../errorUtils";
import { useGetStatusUpdateQuery } from "./statusApi";

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

export type StatusViewProps = {
  pollingInterval?: number; //Defaults to 1000ms
} & BoxProps;

export default function StatusView({
  pollingInterval,
  ...other
}: StatusViewProps) {
  const { data: status, error } = useGetStatusUpdateQuery(undefined, {
    pollingInterval: pollingInterval ?? 1000,
  });

  return (
    <Box {...other}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <ColoredBox color="primary.main" />
        <Typography noWrap>Oven: {status?.oven.toFixed(2) ?? 0.0}°C</Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <ColoredBox color="secondary.main" />
        <Typography noWrap>Chip: {status?.chip.toFixed(2) ?? 0.0}°C</Typography>
      </Box>

      {status && status.fault !== 0 && (
        <Card>
          <Typography color="error">Sensor fault: {status?.fault}</Typography>
          {status?.faultText.map((value, index) => (
            <Typography key={index} color="error">
              {value}
            </Typography>
          ))}
        </Card>
      )}

      {error && <Typography color="error">{getErrorMessage(error)}</Typography>}
    </Box>
  );
}
