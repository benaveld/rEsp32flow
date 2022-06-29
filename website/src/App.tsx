import { Box, createTheme, Paper, ThemeProvider } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import ProfileList from "./profile/profileList";
import RelayStatusView from "./relay/relayStatusView";
import StatusView from "./status/statusView";
import TemperatureChart from "./status/temperatureChart";

const theme = createTheme({
  palette: {
    primary: red,
    secondary: blue,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Paper
          elevation={1}
          sx={{ display: "flex", flexDirection: "column", padding: "1ch" }}
        >
          <StatusView />
          <RelayStatusView />
          <ProfileList />
        </Paper>
        <Box
          sx={{ padding: "1ch", flexGrow: 1, width: "80em", height: "55em" }}
        >
          <TemperatureChart />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
