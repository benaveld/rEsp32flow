import { AppBar, Box, Stack, Toolbar } from "@mui/material";
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
    <Box sx={{ color: "text.primary", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <StatusView sx={{ flexGrow: 1 }} />
          <EStopButton disabled={!isRelayOn}>EStop</EStopButton>
          <NightModeToggleButton />
        </Toolbar>
      </AppBar>

      <Stack
        direction={{ xs: "column-reverse", md: "row" }}
        spacing={{ xs: 2, md: 3 }}
        sx={{ bgcolor: "inherit", marginTop: "8px" }}
      >
        <Box sx={{ flexBasis: "400px" }}>
          <RelayStatusView hidden={!isRelayOn} />
          <ProfileList hidden={isRelayOn} />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            paddingRight: "8px",
          }}
        >
          <TemperatureChart />
        </Box>
      </Stack>
    </Box>
  );
}

export default App;
