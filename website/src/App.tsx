import { Box } from "@mui/material";
import { Provider } from "react-redux";
import ProfileList from "./profile/profileList";
import { store } from "./state";
import StatusView from "./status/statusView";
import TemperatureChart from "./temperature/temperature";

function App() {
  return (
    <Provider store={store}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <StatusView sx={{width: "fit-content"}} />
        <Box sx={{ flexGrow: 1}}>
          <TemperatureChart />
        </Box>
        <ProfileList sx={{margin: "2ch" }} />
      </Box>
    </Provider>
  );
}

export default App;
