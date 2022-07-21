import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "./state";
import { appPalette, AppPaletteKeys, AppPaletteReturnType } from "./appPalette";
import { useTheme } from "@mui/material";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useDocTitle = (title: string) => {
  const [docTitle, setDocTitle] = useState(title);

  useEffect(() => {
    document.title = docTitle;
  }, [docTitle]);

  return [docTitle, setDocTitle];
};

export const useAppColor = (key: AppPaletteKeys) =>
  useTheme().palette[appPalette[key]] as AppPaletteReturnType;
