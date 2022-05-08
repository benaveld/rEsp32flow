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
} from "@mui/material";
import { Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppState } from "../state";
import { getUniqId, Profile, ProfileForm } from "./profile";
import { saveProfile } from "./state/profileActions";

export default function ProfileList() {
  const [open, setOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const dispatch: Dispatch<any> = useDispatch();

  const profiles = useSelector(
    (appState: AppState) => appState.profileState.profiles
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
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

  return (
    <Box>
      <IconButton aria-label="add" onClick={handleClickOpen}>
        <Add />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      {profiles.map((value) => (
        <ProfileForm profile={value} />
      ))}
    </Box>
  );
}
