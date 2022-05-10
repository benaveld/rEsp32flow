import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { ProfileStep } from "./profileStep";

interface ProfileStepViewProps {
  index: number;
  step: ProfileStep;
  setIsEdit: (index?: number) => void;
  onDelete: (index: number) => void;
}

export function ProfileStepView(props: ProfileStepViewProps) {
  const { step, index, setIsEdit, onDelete } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card>
      <CardHeader
        title={"At " + step.temperature + "°C for " + step.timer / 1000 + "sec"}
        action={
          <div>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "profile step options" }}
            >
              <MenuItem onClick={handleClose}>
                <IconButton
                  aria-label="edit step"
                  onClick={() => setIsEdit(index)}
                >
                  <Edit />
                </IconButton>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <IconButton aria-label="delete step" onClick={() => onDelete(index)}>
                  <Delete />
                </IconButton>
              </MenuItem>
            </Menu>
          </div>
        }
      />
      <CardContent>
        <Typography>
          Kp: {step.Kp}&emsp;Ki: {step.Ki}&emsp;Kd: {step.Kd}
        </Typography>
      </CardContent>
    </Card>
  );
}
