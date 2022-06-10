import { Box, createTheme, Paper, ThemeProvider } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import ProfileList from "./profile/profileList";
import {
  loadTemperatureHistory,
  updateStatus,
} from "./status/state/statusActions";
import { keepHistoryTime } from "./status/state/statusSlice";
import StatusView from "./status/statusView";
import TemperatureChart from "./status/temperatureChart";

const theme = createTheme({
  palette: {
    primary: red,
    secondary: blue,
  },
});

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadTemperatureHistory(keepHistoryTime));

    const interval = setInterval(() => {
      dispatch(updateStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Paper
          elevation={1}
          sx={{ display: "flex", flexDirection: "column", padding: "1ch" }}
        >
          <StatusView />
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
