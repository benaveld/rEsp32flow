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
import { ReactNode, useState } from "react";
import { useAppDispatch } from "../hooks";
import { useDeleteProfileStepMutation } from "./profileApi";
import { ProfileStep } from "./profileTypes";
import { editProfileStep } from "./state/profileSlice";

type createActionProps = {
  icon: ReactNode;
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

type ProfileStepViewProps = {
  step: ProfileStep;
  canEdit?: boolean;
} & CardProps;

export function ProfileStepView({
  step,
  canEdit,
  ...other
}: ProfileStepViewProps) {
  const [deleteProfileStep] = useDeleteProfileStepMutation();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const actions = canEdit
    ? [
        createAction({
          key: "edit",
          text: "Edit step",
          icon: <Edit fontSize="small" />,
          onClick: () => {
            handleClose();
            dispatch(editProfileStep(step));
          },
        }),
        createAction({
          key: "delete",
          text: "Delete",
          icon: <Delete fontSize="small" />,
          onClick: () => {
            handleClose();
            deleteProfileStep({ profileId: step.profileId, stepId: step.id });
          },
        }),
      ]
    : [];

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
