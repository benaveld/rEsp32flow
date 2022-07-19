import {
  Box,
  createTheme,
  ThemeProvider,
  PaletteMode,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { createContext, useMemo, useState } from "react";
import AppAppBar from "./appAppBar";
import { useDocTitle } from "./hooks";
import SideBar from "./sideBar";
import TemperatureChart from "./status/temperatureChart";

export const ColorModeContext = createContext({
  toggleColorMode: () => {
    // Empty function
  },
});

type ColorModeContextType = Parameters<
  typeof ColorModeContext.Provider
>[0]["value"];

function App() {
  useDocTitle("rEsp32flow");

  const [mode, setMode] = useState<PaletteMode>(
    useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light"
  );

  const colorMode = useMemo<ColorModeContextType>(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: red,
          secondary: blue,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
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
            <Grid
              item
              xs={true}
              md={10}
              sx={{ minHeight: "55em", height: "auto" }}
            >
              <TemperatureChart />
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
