import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";
import ProfileList from "./profile/profileList";
import { useGetRelayStatusQuery } from "./relay/relayApi";
import RelayStatusView from "./relay/relayStatusView";

const SideBar = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { isRelayOn } = useGetRelayStatusQuery(undefined, {
    selectFromResult: ({ data }) => ({ isRelayOn: data?.info !== undefined }),
  });

  return (
    <Box ref={ref} {...props}>
      <RelayStatusView hidden={!isRelayOn} />
      <ProfileList hidden={isRelayOn} />
    </Box>
  );
});
SideBar.displayName = "SideBar";

export default SideBar;
