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
import { useDeleteProfileMutation } from "./profileApi";
import { ProfileStepForm } from "./profileStepForm";
import { ProfileStepView } from "./profileStepView";
import { initialProfileStep, Profile } from "./profileTypes";
import { editProfileStep } from "./state/profileSlice";

type ProfileViewProps = {
  profile: Profile;
} & Omit<AccordionProps, "children">;

export function ProfileView({ profile, ...other }: ProfileViewProps) {
  const { editingProfileStep } = useAppSelector(
    (appState) => appState.profileState
  );
  const [deleteProfile] = useDeleteProfileMutation();

  const editingStepId =
    editingProfileStep && editingProfileStep.profileId === profile.id
      ? editingProfileStep.id
      : null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  const addStep = () =>
    dispatch(
      editProfileStep({
        ...initialProfileStep,
        profileId: profile.id,
        id: (profile.steps.at(-1)?.id ?? -1) + 1,
      })
    );

  const openDeleteDialog = () => setDeleteDialogOpen(true);
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
        {profile.steps.map((value) =>
          value.id === editingStepId ? (
            <ProfileStepForm
              key={value.id}
              aria-label={profile.name + "_" + value.id + "_edit"}
            />
          ) : (
            <ProfileStepView
              aria-label={profile.name + "_" + value.id}
              key={value.id}
              step={value}
            />
          )
        )}
        {editingStepId &&
          profile.steps.find((v) => v.id === editingStepId) === undefined && (
            <ProfileStepForm
              key={editingStepId}
              aria-label={profile.name + "_" + editingStepId + "_edit"}
            />
          )}
      </AccordionDetails>

      <AccordionActions>
        <IconButton aria-label="start profile" onClick={onStartProfile}>
          <Start />
        </IconButton>

        <IconButton aria-label="add profile step" onClick={addStep}>
          <Add />
        </IconButton>

        <IconButton aria-label="delete profile" onClick={openDeleteDialog}>
          <Delete />
        </IconButton>
      </AccordionActions>
    </Accordion>
  );
}
