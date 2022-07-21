import {
  DeveloperBoard,
  Microwave,
  SvgIconComponent,
} from "@mui/icons-material";
import {
  Palette,
  PaletteColor,
  SvgIconProps,
  SvgIconTypeMap,
} from "@mui/material";
import { forwardRef } from "react";

// Returns only the keys of Type that extends TargetType.
type Only<Type, TargetType> = {
  [Key in keyof Type]: Type[Key] extends TargetType ? Type[Key] : never;
};

export type AppPaletteReturnType = PaletteColor;
interface AppPaletteType {
  [key: string]: keyof Only<Palette, AppPaletteReturnType>;
}

export const appPalette: AppPaletteType = {
  oven: "primary",
  chip: "secondary",
};

export type AppPaletteKeys = keyof typeof appPalette;

export const appIconPalette = {
  oven: mapIcon(Microwave, "oven"),
  chip: mapIcon(DeveloperBoard, "chip"),
};

function mapIcon(Element: SvgIconComponent, key: keyof typeof appPalette) {
  const component = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
    <Element
      ref={ref}
      color={appPalette[key] as SvgIconTypeMap["props"]["color"]}
      {...props}
    />
  ));
  component.displayName = `${key} icon`;
  return component;
}
