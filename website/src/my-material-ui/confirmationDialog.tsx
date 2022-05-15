import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

export interface ConfirmationDialogProps {
  id: string;
  keepMounted: boolean;
  title: string;
  confirmationText?: string;
  cancelText?: string;
  open: boolean;
  onClose: (value: boolean) => void;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { onClose, title, confirmationText, cancelText, open, ...other } =
    props;

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={handleCancel}
      {...other}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          {cancelText ?? "Cancel"}
        </Button>
        <Button onClick={handleOk}>{confirmationText ?? "Ok"}</Button>
      </DialogActions>
    </Dialog>
  );
}