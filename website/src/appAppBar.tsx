import { AppBar, AppBarProps, Box, Toolbar } from "@mui/material";
import { forwardRef } from "react";
import NightModeToggleButton from "./nightModeButton";
import StatusView from "./status/statusView";

export type AppAppBarProps = AppBarProps;

const AppAppBar = forwardRef<HTMLDivElement, AppAppBarProps>((props, ref) => {
  return (
    <AppBar ref={ref} {...props}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <StatusView />
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <NightModeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
});
AppAppBar.displayName = "AppAppBar";

export default AppAppBar;
