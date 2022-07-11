import { Alert, Box, BoxProps, Snackbar, Typography } from "@mui/material";
import { SubscriptionOptions } from "@reduxjs/toolkit/dist/query/core/apiState";
import { getErrorMessage } from "../errorUtils";
import { useGetStatusUpdateQuery } from "./statusApi";
import TemperatureView from "./temperatureView";

export type StatusViewProps = BoxProps &
  Pick<SubscriptionOptions, "pollingInterval">;

export default function StatusView({
  pollingInterval = 1000,
  ...other
}: StatusViewProps) {
  const { data: status, error } = useGetStatusUpdateQuery(undefined, {
    pollingInterval,
  });

  return (
    <Box {...other}>
      <TemperatureView
        color="primary.main"
        temperature={status?.oven ?? -999}
        prepend="Oven: "
      />
      <TemperatureView
        color="secondary.main"
        temperature={status?.chip ?? -999}
        prepend="Chip: "
      />

      <Snackbar open={status && status.fault !== 0}>
        <Alert severity="error">
          <Typography color="error">Sensor fault: {status?.fault}</Typography>
          {status?.faultText.map((value, index) => (
            <Typography key={index} color="error">
              {value}
            </Typography>
          ))}
        </Alert>
      </Snackbar>

      <Snackbar open={error !== undefined}>
        <Alert severity="error">{getErrorMessage(error)}</Alert>
      </Snackbar>
    </Box>
  );
}
