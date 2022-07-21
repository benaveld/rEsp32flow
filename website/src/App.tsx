import { AppBar, Box, Grid, Toolbar } from "@mui/material";
import TemperatureChart from "./status/temperatureChart";
import { useGetRelayStatusQuery } from "./relay/relayApi";
import ProfileList from "./profile/profileList";
import RelayStatusView, { EStopButton } from "./relay/relayStatusView";
import StatusView from "./status/statusView";
import NightModeToggleButton from "./nightModeButton";

function App() {
  const { isRelayOn } = useGetRelayStatusQuery(undefined, {
    selectFromResult: ({ data }) => ({ isRelayOn: data?.info !== undefined }),
  });

  return (
    <Box sx={{ color: "text.primary" }}>
      <AppBar position="sticky">
        <Toolbar>
          <StatusView sx={{ flexGrow: 1 }} />
          <EStopButton disabled={!isRelayOn}>EStop</EStopButton>
          <NightModeToggleButton />
        </Toolbar>
      </AppBar>

      <Grid
        container
        direction="row-reverse"
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ bgcolor: "background.default" }}
      >
        <Grid item xs={true} md={10}>
          <TemperatureChart />
        </Grid>

        <Grid item xs={true} md={2}>
          <RelayStatusView hidden={!isRelayOn} />
          <ProfileList hidden={isRelayOn} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
