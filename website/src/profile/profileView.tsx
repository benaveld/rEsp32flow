import { Add, Delete, ExpandMore, Start } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import ConfirmationDialog from "../my-material-ui/confirmationDialog";
import { startRelay } from "../relay/relayActions";
import { Profile } from "./profile";
import { initialProfileStep } from "./profileStep";
import { ProfileStepForm } from "./profileStepForm";
import { ProfileStepView } from "./profileStepView";
import { deleteProfile, deleteProfileStep } from "./state/profileActions";
import { editProfileStep, stopEditingProfileStep } from "./state/profileSlice";

interface ProfileViewProps {
  profile: Profile;
  editingStepIndex?: number;
}

export function ProfileView(props: ProfileViewProps) {
  const { profile } = props;
  const { editingProfileStep } = useAppSelector(
    (appState) => appState.profileState
  );

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
    dispatch(deleteProfileStep({ profile, stepIndex }));

  const onDeleteProfile = (doDelete: boolean) => {
    if (doDelete) dispatch(deleteProfile(profile.id));
    setDeleteDialogOpen(false);
  };

  const onStartProfile = () => startRelay(profile.id);

  return (
    <Accordion>
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
            <ProfileStepForm key={index} />
          ) : (
            <ProfileStepView
              key={index}
              index={index}
              step={value}
              setIsEdit={setEditStep}
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
