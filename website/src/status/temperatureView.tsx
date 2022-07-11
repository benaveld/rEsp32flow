import { BoxProps, Box, Typography } from "@mui/material";
import { forwardRef } from "react";

type ColoredBoxProps = Required<Pick<BoxProps, "color">> &
  Omit<BoxProps, "color" | "bgcolor">;

const ColoredBox = forwardRef<HTMLDivElement, ColoredBoxProps>(
  ({ color, sx, ...other }, ref) => {
    return (
      <Box
        ref={ref}
        bgcolor={color}
        sx={{
          border: "thin solid black",
          width: "0.8em",
          height: "0.8em",
          margin: "auto 0.2em",
          ...sx,
        }}
        {...other}
      />
    );
  }
);
ColoredBox.displayName = "ColoredBox";

export interface TemperatureViewProps extends BoxProps {
  temperature: number;
  fractionDigits?: number;
  prepend?: string | JSX.Element;
  append?: string | JSX.Element;
}

const TemperatureView = forwardRef<HTMLDivElement, TemperatureViewProps>(
  (
    { color, temperature, prepend, append, fractionDigits = 2, sx, ...other },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        sx={{ display: "flex", flexDirection: "row", ...sx }}
        {...other}
      >
        {color !== undefined && <ColoredBox color={color} />}
        <Typography>
          {prepend}
          {temperature.toFixed(fractionDigits)}°C
          {append}
        </Typography>
      </Box>
    );
  }
);
TemperatureView.displayName = "TemperatureView";

export default TemperatureView;
