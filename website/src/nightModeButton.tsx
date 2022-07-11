import { Brightness4, Brightness7 } from "@mui/icons-material";
import { IconButton, IconButtonProps, useTheme } from "@mui/material";
import { forwardRef, useContext } from "react";
import { ColorModeContext } from "./App";

export type NightModeToggleButtonProps = {
  darkElement?: JSX.Element;
  lightElement?: JSX.Element;
} & Omit<IconButtonProps, "onClick">;

const NightModeToggleButton = forwardRef<
  HTMLButtonElement,
  NightModeToggleButtonProps
>(
  (
    { darkElement = <Brightness7 />, lightElement = <Brightness4 />, ...other },
    ref
  ) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
      <IconButton ref={ref} onClick={colorMode.toggleColorMode} {...other}>
        {theme.palette.mode === "dark" ? darkElement : lightElement}
      </IconButton>
    );
  }
);
NightModeToggleButton.displayName = "NightModeToggleButton";

export default NightModeToggleButton;
