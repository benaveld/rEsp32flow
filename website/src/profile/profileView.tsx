import { Add, Delete, ExpandMore, Start } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import ConfirmationDialog from "../my-material-ui/confirmationDialog";
import { useStartRelayMutation } from "../relay/relayApi";
import { useDeleteProfileMutation } from "./profileApi";
import { ProfileStepForm } from "./profileStepForm";
import { ProfileStepView } from "./profileStepView";
import { Profile, selectProfileStep } from "./profileTypes";
import {
  addProfileStep,
  selectEditingProfileStepsId,
} from "./state/profileSlice";

type ProfileViewProps = {
  profile: Profile;
} & Omit<AccordionProps, "children">;

export const ProfileView = ({ profile, ...other }: ProfileViewProps) => {
  const editingStepId = useAppSelector(selectEditingProfileStepsId);

  const dispatch = useAppDispatch();

  const addStep = () => dispatch(addProfileStep(profile));
  const [deleteProfile] = useDeleteProfileMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const openDeleteDialog = () => setDeleteDialogOpen(true);
  const onDeleteProfile = (doDelete: boolean) => {
    if (doDelete) deleteProfile(profile.id);
    setDeleteDialogOpen(false);
  };

  const [startRelay] = useStartRelayMutation();
  const onStartProfile = () => startRelay(profile.id);

  return (
    <Accordion aria-label={`${profile.id} ${profile.name}`} {...other}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">{profile.name}</Typography>
        <ConfirmationDialog
          id="delete-profile-dialog"
          title={"Delete: " + profile.name + "?"}
          keepMounted
          open={deleteDialogOpen}
          onClose={onDeleteProfile}
          confirmationText="Delete"
        />
      </AccordionSummary>

      <AccordionDetails>
        {addDividers(
          profile.steps.map((step) =>
            step.id === editingStepId ? (
              <ProfileStepForm
                key={step.id}
                aria-label={profile.name + "_" + step.id + "_edit"}
              />
            ) : (
              <ProfileStepView
                aria-label={profile.name + "_" + step.id}
                key={step.id}
                step={step}
                canEdit
              />
            )
          )
        )}

        {editingStepId !== undefined &&
          selectProfileStep(profile, editingStepId) === undefined && (
            <ProfileStepForm
              key={editingStepId}
              aria-label={profile.name + "_" + editingStepId + "_edit"}
            />
          )}
      </AccordionDetails>

      <AccordionActions>
        <IconButton onClick={onStartProfile}>
          <Start />
        </IconButton>

        <IconButton onClick={addStep}>
          <Add />
        </IconButton>

        <IconButton onClick={openDeleteDialog}>
          <Delete />
        </IconButton>
      </AccordionActions>
    </Accordion>
  );
};

const addDividers = (list: JSX.Element[]) =>
  list.flatMap((value, index) =>
    index > 0 ? [<Divider key={`divider ${index}`} />, value] : value
  );
