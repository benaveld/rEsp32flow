import {
  Box,
  createTheme,
  ThemeProvider,
  PaletteMode,
  useMediaQuery,
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "1ch",
                height: "100%",
                flexGrow: 0,
              }}
            >
              <SideBar />
            </Box>
            <Box
              sx={{
                padding: "1ch",
                flexGrow: 1,
                minWidth: "80em",
                minHeight: "55em",
              }}
            >
              <TemperatureChart />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
