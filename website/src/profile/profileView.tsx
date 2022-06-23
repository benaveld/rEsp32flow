import { Add, Delete, ExpandMore, Start } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import ConfirmationDialog from "../my-material-ui/confirmationDialog";
import { startRelay } from "../relay/relayActions";
import { Profile } from "./profile";
import { useDeleteProfileMutation, useDeleteProfileStepMutation } from "./profileApi";
import { initialProfileStep } from "./profileStep";
import { ProfileStepForm } from "./profileStepForm";
import { ProfileStepView } from "./profileStepView";
import { editProfileStep, stopEditingProfileStep } from "./state/profileSlice";

type ProfileViewProps = {
  profile: Profile;
} & Omit<AccordionProps, "children">;

export function ProfileView({profile, ...other}: ProfileViewProps) {
  const { editingProfileStep } = useAppSelector(
    (appState) => appState.profileState
  );
  const [deleteProfile] = useDeleteProfileMutation();
  const [deleteProfileStep] = useDeleteProfileStepMutation();

  const editingStepIndex =
    editingProfileStep?.profile.id === profile.id
      ? editingProfileStep.stepIndex
      : null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const addStep = () =>
    dispatch(editProfileStep({ profile, step: initialProfileStep }));

  const setEditStep = (stepIndex?: number) => {
    if (stepIndex === undefined) {
      return dispatch(stopEditingProfileStep());
    }
    dispatch(
      editProfileStep({ profile, step: profile.steps[stepIndex], stepIndex })
    );
  };

  const onDeleteStep = (stepIndex: number) =>
    deleteProfileStep({ id: profile.id, stepIndex });

  const onDeleteProfile = (doDelete: boolean) => {
    if (doDelete) deleteProfile(profile.id);
    setDeleteDialogOpen(false);
  };

  const onStartProfile = () => startRelay(profile.id);

  return (
    <Accordion aria-label={"profile: " + profile.id} {...other}>
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
        {profile.steps.map((value, index) =>
          index === editingStepIndex ? (
            <ProfileStepForm
              key={index}
              aria-label={profile.name + "_" + index + "_edit"}
            />
          ) : (
            <ProfileStepView
              aria-label={profile.name + "_" + index}
              key={index}
              index={index}
              step={value}
              onEdit={setEditStep}
              onDelete={onDeleteStep}
            />
          )
        )}
        {profile.steps.length === editingStepIndex && (
          <ProfileStepForm key={editingStepIndex} />
        )}
      </AccordionDetails>

      <AccordionActions>
        <IconButton aria-label="start profile" onClick={onStartProfile}>
          <Start />
        </IconButton>

        <IconButton aria-label="add profile step" onClick={addStep}>
          <Add />
        </IconButton>

        <IconButton
          aria-label="delete profile"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Delete />
        </IconButton>
      </AccordionActions>
    </Accordion>
  );
}
