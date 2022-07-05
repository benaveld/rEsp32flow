import { Add } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Paper,
  PaperProps,
} from "@mui/material";
import { useState } from "react";
import { getErrorMessage } from "../errorUtils";
import {
  selectAllProfiles,
  useGetProfilesQuery,
  usePutProfileMutation,
} from "./profileApi";
import ProfileNameDialog, { ProfileNameDialogProps } from "./profileNameDialog";
import { getUniqId } from "./profileTypes";
import { ProfileView } from "./profileView";

export default function ProfileList(props: PaperProps) {
  const [putProfile] = usePutProfileMutation();
  const [open, setOpen] = useState(false);

  const { profiles, error } = useGetProfilesQuery(undefined, {
    selectFromResult: ({ data, error }) => ({
      error,
      profiles: selectAllProfiles(data),
    }),
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit: ProfileNameDialogProps["onSubmit"] = (_event, name) => {
    handleClose();
    putProfile({ profile: { id: getUniqId(profiles), name: name, steps: [] } });
  };

  return (
    <Paper elevation={2} {...props}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography variant="h5" sx={{ width: "100%", margin: "1ch 0 0 1ch" }}>
          Profiles
        </Typography>

        <Tooltip title="Create a new Profile">
          <IconButton aria-label="create profile" onClick={handleClickOpen}>
            <Add />
          </IconButton>
        </Tooltip>
      </Box>

      {error && <Typography>{getErrorMessage(error)}</Typography>}

      <ProfileNameDialog
        open={open}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />

      {profiles.map((profile) => (
        <ProfileView key={profile.id} profile={profile} />
      ))}
    </Paper>
  );
}
