import { Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  CardProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
  Typography,
} from "@mui/material";
import { useState } from "react";
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

const addAction = (
  actions: JSX.Element[],
  isEnabled: boolean,
  props: createActionProps
) => (isEnabled ? actions.concat(createAction(props)) : actions);

type ProfileStepViewProps = {
  index: number;
  step: ProfileStep;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
} & CardProps;

export function ProfileStepView(props: ProfileStepViewProps) {
  const { step, index, onEdit, onDelete, ...other } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let actions = addAction([], onEdit !== undefined, {
    key: "edit",
    text: "Edit step",
    icon: <Edit fontSize="small" />,
    onClick: () => {
      handleClose();
      onEdit!(index);
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
    <Card {...other}>
      <CardHeader
        title={
          <Typography noWrap variant="h6">
            At {step.temperature}°C for {step.timer}sec
          </Typography>
        }
        subheader={
          <Typography noWrap variant="body1">
            Kp: {step.Kp} Ki: {step.Ki} Kd: {step.Kd}
          </Typography>
        }
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
