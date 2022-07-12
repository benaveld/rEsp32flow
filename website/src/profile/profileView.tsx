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
      sx: { margin: "8px 0px" },
      elevation: 2,
    };

  const editingStepFormProps: ProfileStepFormProps = {
    ...commonSettings,
    key: editingStepId,
    "aria-label": `${profile.name}_${editingStepId}_edit`,
  };

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
        {profile.steps.map((step) =>
          step.id === editingStepId ? (
            <ProfileStepForm {...editingStepFormProps} />
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

        {editingStepId !== undefined &&
          selectProfileStep(profile, editingStepId) === undefined && (
            <ProfileStepForm {...editingStepFormProps} />
          )}
      </AccordionDetails>

      <AccordionActions>
        <IconButton onClick={onStartProfile}>
          <Start />
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
