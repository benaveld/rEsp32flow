import { Settings } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  IconButton,
  Button,
  Box,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButtonProps,
} from "@mui/material";
import { Fragment, useState } from "react";
import { onSubmitType } from "./AppTypes";
import { RelaySampleRateField } from "./relay/settings/relaySampleRateField";

export interface SettingsDialogProps {
  dialogProps?: DialogProps;
  iconButtonProps?: IconButtonProps;
}

export const SettingsDialog = (props: SettingsDialogProps) => {
  const [childSubmits, setChildSubmits] = useState<onSubmitType[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit: onSubmitType = (ev) => {
    ev.preventDefault();
    childSubmits.forEach((func) => func(ev));
    handleClose();
  };

  return (
    <Fragment>
      <IconButton onClick={handleOpen} {...props.iconButtonProps}>
        <Settings />
      </IconButton>

      <Dialog open={open} {...props.dialogProps}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Settings</DialogTitle>

          <DialogContent>
            <RelaySampleRateField addSubmitHandler={setChildSubmits} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Fragment>
  );
};
