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
import { Dispatch, useEffect, useState, SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import { getUniqId, Profile } from "./profile";
import { ProfileView } from "./profileView";
import { loadProfiles, saveProfile } from "./state/profileActions";

export default function ProfileList(props: PaperProps) {
  const [open, setOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const dispatch: Dispatch<any> = useDispatch();

  const { profiles, error } = useSelector(
    (appState: AppState) => appState.profileState
  );

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    handleClose();
    const id = getUniqId(profiles);
    const profile = new Profile({ id, name: newProfileName });
    dispatch(saveProfile(profile));
  };

  const handleNewProfileNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewProfileName(event.target.value);
  };

  useEffect(() => {
    dispatch(loadProfiles());
  }, [dispatch]);

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

      {error !== undefined && <Typography>{error}</Typography>}

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
