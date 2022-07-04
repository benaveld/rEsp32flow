import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { DialogContent } from "@mui/material";

export type ConfirmationDialogProps = {
  cancelText?: string;
  confirmationText?: string;
  onClose: (value: boolean) => void;
  title: string;
} & Omit<DialogProps, "onClose">;

export default function ConfirmationDialog({
  cancelText,
  confirmationText,
  onClose,
  title,
  ...other
}: ConfirmationDialogProps) {
  const handleCancel = () => onClose(false);
  const handleOk = () => onClose(true);

  return (
    <Dialog
      maxWidth="xs"
      onClose={handleCancel}
      {...other}
      sx={{
        "& .MuiDialog-paper": { width: "80%", maxHeight: 435 },
        ...other.sx,
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      {other.children !== undefined && (
        <DialogContent>{other.children}</DialogContent>
      )}

      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          {cancelText ?? "Cancel"}
        </Button>
        <Button onClick={handleOk}>{confirmationText ?? "Ok"}</Button>
      </DialogActions>
    </Dialog>
  );
}
