import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  Paper,
  PaperProps,
} from "@mui/material";
import { useState, SyntheticEvent } from "react";
import { getErrorMessage } from "../errorUtils";
import {
  selectAllProfiles,
  useGetProfilesQuery,
  usePutProfileMutation,
} from "./profileApi";
import { getUniqId } from "./profileTypes";
import { ProfileView } from "./profileView";

export default function ProfileList(props: PaperProps) {
  const [putProfile] = usePutProfileMutation();
  const [open, setOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");

  const { data: profileQueryData, error } = useGetProfilesQuery();
  const profiles = selectAllProfiles(profileQueryData);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleClose();
    putProfile({ id: getUniqId(profiles), name: newProfileName, steps: [] });
  };

  const handleNewProfileNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => setNewProfileName(event.target.value);

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

      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Profile name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="profile-name-form"
              label="Profile name"
              type="text"
              fullWidth
              value={newProfileName}
              onChange={handleNewProfileNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {profiles.map((value) => {
        return <ProfileView key={value.id} profile={value} />;
      })}
    </Paper>
  );
}
