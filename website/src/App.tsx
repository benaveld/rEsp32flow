import { Box, createTheme, Paper, ThemeProvider } from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { Provider } from "react-redux";
import ProfileList from "./profile/profileList";
import { store } from "./state";
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
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
