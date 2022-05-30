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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import ConfirmationDialog from "../my-material-ui/confirmationDialog";
import { startRelay } from "../relay/relayActions";
import { AppState } from "../state";
import { Profile } from "./profile";
import { ProfileStep } from "./profileStep";
import { ProfileStepForm } from "./profileStepForm";
import { ProfileStepView } from "./profileStepView";
import {
  deleteProfile,
  editProfileStep,
  stopEditingProfileStep,
} from "./state/profileActions";

interface ProfileViewProps {
  profile: Profile;
  editingStepIndex?: number;
}

export function ProfileView(props: ProfileViewProps) {
  const { profile } = props;
  const { editingProfileStep } = useSelector(
    (appState: AppState) => appState.profileState
  );

  const editingStepIndex =
    editingProfileStep?.profile.id === profile.id
      ? editingProfileStep.stepIndex
      : null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch: Dispatch<any> = useDispatch();

  const addStep = () => dispatch(editProfileStep(profile, new ProfileStep()));
  const setEditStep = (index?: number) => {
    if (index === undefined) {
      return dispatch(stopEditingProfileStep());
    }
    dispatch(editProfileStep(profile, profile.steps[index], index));
  };

  const onDeleteStep = (index: number) =>
    dispatch(deleteProfile(profile, index));

  const onDeleteProfile = (doDelete: boolean) => {
    if (doDelete) dispatch(deleteProfile(profile));
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
