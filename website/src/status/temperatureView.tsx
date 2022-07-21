import { Typography, Stack, StackProps, SvgIconProps } from "@mui/material";
import { forwardRef, ReactNode } from "react";
import { appIconPalette } from "../appPalette";

export interface TemperatureViewProps extends StackProps {
  temperature: number;
  fractionDigits?: number;
  prepend?: ReactNode;
  append?: ReactNode;
  type: keyof typeof appIconPalette;
  iconProps?: SvgIconProps;
}

const TemperatureView = forwardRef<HTMLDivElement, TemperatureViewProps>(
  (
    {
      type,
      temperature,
      prepend,
      append,
      iconProps,
      fractionDigits = 2,
      ...other
    },
    ref
  ) => {
    const Icon = appIconPalette[type];
    return (
      <Stack ref={ref} direction="row" spacing={1} {...other}>
        <Icon {...iconProps} />
        <Typography>
          {prepend}
          {temperature.toFixed(fractionDigits)}°C
          {append}
        </Typography>
      </Stack>
    );
  }
);
TemperatureView.displayName = "TemperatureView";

export default TemperatureView;
