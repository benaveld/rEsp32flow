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
import ConfirmationDialog from "../my-material-ui/confirmationDialog";
import {
  selectAllProfiles,
  useCreateProfileMutation,
  useDeleteProfileMutation,
  useGetProfilesQuery,
} from "./profileApi";
import ProfileNameDialog, { ProfileNameDialogProps } from "./profileNameDialog";
import { Profile } from "./profileTypes";
import { ProfileView, ProfileViewProps } from "./profileView";

export default function ProfileList(props: PaperProps) {
  const [open, setOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | undefined>(
    undefined
  );

  const [deleteProfile] = useDeleteProfileMutation();
  const [createProfile] = useCreateProfileMutation();
  const { profiles } = useGetProfilesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      profiles: selectAllProfiles(data),
    }),
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit: ProfileNameDialogProps["onSubmit"] = (_event, name) => {
    handleClose();
    createProfile({ name });
  };

  const onDeleteProfile = (doDelete: boolean) => {
    if (doDelete && profileToDelete) deleteProfile(profileToDelete.id);
    setProfileToDelete(undefined);
  };
  const handleProfileDelete: ProfileViewProps["onDelete"] = (profile) =>
    setProfileToDelete(profile);

  return (
    <Paper elevation={2} {...props}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography variant="h5" sx={{ flexGrow: 1, margin: "1ch 0 0 1ch" }}>
          Profiles
        </Typography>

        <Tooltip title="Create a new Profile" sx={{ flexGrow: 0 }}>
          <IconButton aria-label="create profile" onClick={handleClickOpen}>
            <Add />
          </IconButton>
        </Tooltip>
      </Box>

      <ProfileNameDialog
        open={open}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />

      {profiles.map((profile) => (
        <ProfileView
          onDelete={handleProfileDelete}
          key={profile.id}
          profile={profile}
        />
      ))}

      <ConfirmationDialog
        id="delete-profile-dialog"
        title={`Delete: ${profileToDelete?.name}?`}
        keepMounted
        open={profileToDelete !== undefined}
        onClose={onDeleteProfile}
        confirmationText="Delete"
      />
    </Paper>
  );
}
