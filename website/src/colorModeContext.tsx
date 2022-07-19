import {
  createTheme,
  Palette,
  PaletteColor,
  PaletteMode,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";
import { createContext, ReactNode, useMemo, useState } from "react";

// Returns only the keys of Type that extends TargetType.
type Only<Type, TargetType> = {
  [Key in keyof Type]: Type[Key] extends TargetType ? TargetType : never;
};

export type AppPaletteReturnType = PaletteColor;
interface AppPaletteType {
  [key: string]: keyof Only<Palette, AppPaletteReturnType>;
}

export const appPalette: AppPaletteType = {
  oven: "primary",
  chip: "secondary",
};

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
