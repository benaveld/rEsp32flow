import { Add, Delete, ExpandMore, PlayArrow } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useStartRelayMutation } from "../relay/relayApi";
import { ProfileStepForm, ProfileStepFormProps } from "./profileStepForm";
import { ProfileStepView, ProfileStepViewProps } from "./profileStepView";
import { Profile, selectProfileStep } from "./profileTypes";
import {
  addProfileStep,
  selectEditingProfileStepsId,
} from "./state/profileSlice";

export interface ProfileViewProps extends Omit<AccordionProps, "children"> {
  profile: Profile;
  onDelete: (profile: Profile) => void;
}

export const ProfileView = ({
  profile,
  onDelete,
  ...other
}: ProfileViewProps) => {
  const editingStepId = useAppSelector(selectEditingProfileStepsId);

  const dispatch = useAppDispatch();

  const addStep = () => dispatch(addProfileStep(profile));

  const [startRelay] = useStartRelayMutation();
  const onStartProfile = () => startRelay(profile.id);

  const commonSettings: Pick<ProfileStepViewProps, keyof ProfileStepFormProps> =
    {
      elevation: 2,
    };

  const EditingStepForm = (
    <ProfileStepForm
      {...commonSettings}
      key={editingStepId}
      aria-label={`${profile.name}_${editingStepId}_edit`}
    />
  );

  return (
    <Accordion aria-label={`${profile.id} ${profile.name}`} {...other}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`profile-view-summary-${profile.id}`}
        aria-controls={`profile-view-summary-${profile.id}`}
      >
        <Typography variant="h6">{profile.name}</Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: "0em 0.5em" }}>
        <Stack spacing={2}>
          {profile.steps.map((step) =>
            step.id === editingStepId ? (
              EditingStepForm
            ) : (
              <ProfileStepView
                {...commonSettings}
                aria-label={profile.name + "_" + step.id}
                key={step.id}
                step={step}
                canEdit
              />
            )
          )}
        </Stack>

        {editingStepId !== undefined &&
          selectProfileStep(profile, editingStepId) === undefined &&
          EditingStepForm}
      </AccordionDetails>

      <AccordionActions>
        <IconButton onClick={onStartProfile}>
          <PlayArrow />
        </IconButton>

        <IconButton onClick={addStep}>
          <Add />
        </IconButton>

        <IconButton onClick={() => onDelete(profile)}>
          <Delete />
        </IconButton>
      </AccordionActions>
    </Accordion>
  );
};
