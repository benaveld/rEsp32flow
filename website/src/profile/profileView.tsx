import { Add, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { merge } from "../myUtils";
import { Profile } from "./profile";
import { ProfileStep } from "./profileStep";
import { ProfileStepForm } from "./profileStepForm";
import { ProfileStepView } from "./profileStepView";
import { deleteProfile, saveProfile } from "./state/profileActions";

interface ProfileViewProps {
  profile: Profile;
}

export function ProfileView(props: ProfileViewProps) {
  const [profile, setProfile] = useState(props.profile);
  const dispatch: Dispatch<any> = useDispatch();

  const [editingStepId, setEditingStepId] = useState<React.Key | undefined>(
    undefined
  );

  const addStep = () => {
    const key = profile.steps.length;
    setProfile({
      ...profile,
      steps: merge([profile.steps, [new ProfileStep()]]),
    });
    setEditingStepId(key);
  };

  const onEditStep = (newStep: ProfileStep, index: number) => {
    setEditingStepId(undefined);
    dispatch(saveProfile(profile, newStep, index));
  };

  const onDeleteStep = (index: number) => {
    dispatch(deleteProfile(profile, index));
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{profile.name}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {profile.steps.map((value, index) =>
          index === editingStepId ? (
            <ProfileStepForm
              key={index}
              index={index}
              step={value}
              setIsEdit={setEditingStepId}
              onEdit={onEditStep}
            />
          ) : (
            <ProfileStepView
              key={index}
              index={index}
              step={value}
              setIsEdit={setEditingStepId}
              onDelete={onDeleteStep}
            />
          )
        )}
      </AccordionDetails>

      <AccordionActions>
        <IconButton aria-label="add" onClick={addStep}>
          <Add />
        </IconButton>
      </AccordionActions>
    </Accordion>
  );
}
