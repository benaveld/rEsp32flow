import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";

export type ProfileNameDialogProps = {
  onSubmit: (event: SyntheticEvent, name: string) => void;
  onClose: (
    event: SyntheticEvent,
    reason: "backdropClick" | "escapeKeyDown" | "cancelClick"
  ) => void;
} & Omit<DialogProps, "onClose" | "onSubmit">;

const ProfileNameDialog = ({
  onSubmit,
  onClose,
  ...other
}: ProfileNameDialogProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (ev: SyntheticEvent) => {
    ev.preventDefault();
    onSubmit(ev, name);
  };

  const handleClose = (ev: SyntheticEvent) => onClose(ev, "cancelClick");

  return (
    <Dialog onClose={onClose} {...other}>
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
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ProfileNameDialog;
