import { Box, Grid } from "@mui/material";
import AppAppBar from "./appAppBar";
import { useDocTitle } from "./hooks";
import SideBar from "./sideBar";
import TemperatureChart from "./status/temperatureChart";

function App() {
  useDocTitle("rEsp32flow");

  return (
    <Box bgcolor="background.default" color="text.primary">
      <AppAppBar position="sticky" />

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        bgcolor="background.default"
      >
        <Grid item xs={true} md={2}>
          <SideBar />
        </Grid>
        <Grid item xs={true} md={10} sx={{ minHeight: "55em", height: "auto" }}>
          <TemperatureChart />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
