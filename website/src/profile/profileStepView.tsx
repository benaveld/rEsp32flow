import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
} from "@mui/material";
import { useState } from "react";
import { merge } from "../myUtils";
import { ProfileStep } from "./profileStep";

type createActionProps = {
  icon: any;
  text: string;
} & MenuItemProps;

function createAction(props: createActionProps) {
  const { icon, text, ...other } = props;
  return (
    <MenuItem {...other}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
}

function addAction(
  actions: JSX.Element[],
  isEnabled: boolean,
  props: createActionProps
) {
  if (!isEnabled) return actions;
  return merge([actions, [createAction(props)]]);
}

interface ProfileStepViewProps {
  index: number;
  step: ProfileStep;
  setIsEdit?: (index?: number) => void;
  onDelete?: (index: number) => void;
}

export function ProfileStepView(props: ProfileStepViewProps) {
  const { step, index, setIsEdit, onDelete } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let actions = addAction([], setIsEdit !== undefined, {
    key: "edit",
    text: "Edit step",
    icon: <Edit fontSize="small" />,
    onClick: () => {
      handleClose();
      setIsEdit!(index);
    },
  });

  actions = addAction(actions, onDelete !== undefined, {
    key: "delete",
    text: "Delete",
    icon: <Delete fontSize="small" />,
    onClick: () => {
      handleClose();
      onDelete!(index);
    },
  });

  return (
    <Card>
      <CardHeader
        title={"At " + step.temperature + "°C for " + step.timer / 1000 + "sec"}
        subheader={"Kp: " + step.Kp + "\tKi: " + step.Ki + "\tKd: " + step.Kd}
        action={
          actions.length > 0 && (
            <div>
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "profile step options" }}
              >
                {actions}
              </Menu>
            </div>
          )
        }
      />
    </Card>
  );
}
