import {
  createTheme,
  PaletteMode,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { createContext, ReactNode, useMemo, useState } from "react";

export const ColorModeContext = createContext({
  toggleColorMode: () => {
    // Empty function
  },
});

export type ColorModeContextType = Parameters<
  typeof ColorModeContext.Provider
>[0]["value"];

export interface ColorModeContextProviderProps {
  children?: ReactNode;
}

export const ColorModeContextProvider = ({
  children,
}: ColorModeContextProviderProps) => {
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
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
