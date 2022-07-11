import {
  Box,
  createTheme,
  ThemeProvider,
  PaletteMode,
  useMediaQuery,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import {
  createContext,
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import AppAppBar from "./appAppBar";
import { useDocTitle } from "./hooks";
import SideBar from "./sideBar";
import TemperatureChart from "./status/temperatureChart";

export const ColorModeContext = createContext({
  toggleColorMode: () => {
    // Empty function
  },
});

const useRefDimensions = <t extends RefObject<HTMLElement>>(ref: t) => {
  const [dimensions, setDimensions] = useState({ width: 1, height: 2 });
  useEffect(() => {
    if (ref.current) {
      setDimensions(ref.current.getBoundingClientRect());
    }
  }, [ref]);
  return dimensions;
};

function App() {
  useDocTitle("rEsp32flow");

  const [mode, setMode] = useState<PaletteMode>(
    useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light"
  );

  const colorMode = useMemo(
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

  const ref = createRef<HTMLDivElement>();
  const appBarDimensions = useRefDimensions(ref);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box bgcolor="background.default" color="text.primary">
          <AppAppBar ref={ref} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: appBarDimensions.height + "px",
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
                width: "80em",
                height: "55em",
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
