import { Box, Paper } from "@mui/material";
import { Provider } from "react-redux";
import ProfileList from "./profile/profileList";
import { store } from "./state";
import StatusView from "./status/statusView";
import TemperatureChart from "./status/temperatureChart";

function App() {
  return (
    <Provider store={store}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Paper
          elevation={1}
          sx={{ display: "flex", flexDirection: "column", padding: "1ch" }}
        >
          <StatusView />
          <ProfileList />
        </Paper>
        <Box sx={{ padding: "1ch", flexGrow: 1, width: "80em", height: "55em" }}>
          <TemperatureChart />
        </Box>
      </Box>
    </Provider>
  );
}

export default App;
