import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { ProfileStep, ProfileStepForm, ProfileStepView } from "./profileStep";
import { saveProfile } from "./state/profileActions";

export class Profile {
  id: number = 0;
  name: string = "";
  steps: ProfileStep[] = [];

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.name) this.name = initializer.name;
    if (initializer.steps) this.steps = initializer.steps;
  }
}

// This assumes that the profiles are sorted by id.
export function getUniqId(profiles: Profile[]) : number {
  let id = 0
  profiles.forEach(value => {
    if(value.id === id){
      id++;
    }
  });
  return id;
}

//TODO create ProfileView

interface ProfileProps {
  profile: Profile;
}

export function ProfileForm(props: ProfileProps) {
  const { profile} = props;
  const dispatch: Dispatch<any> = useDispatch();

  const [editingStepId, setEditingStepId] = useState<number | undefined>(
    undefined
  );

  const addStep = () => {
    const id = profile.steps.length;
    setEditingStepId(id);
  };

  const onEditStep = (newStep: ProfileStep) => {
    setEditingStepId(undefined);
    dispatch(saveProfile(profile, newStep));
  };

  const setEditStep = (step?: ProfileStep) => {
    setEditingStepId(step?.id);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{profile.name}</Typography>
        <Box>
          {profile.steps.map((step) =>
            editingStepId === step.id ? (
              <ProfileStepForm
                key={step.id}
                step={step}
                onEdit={onEditStep}
                setIsEdit={setEditStep}
              />
            ) : (
              <ProfileStepView
                key={step.id}
                step={step}
                setIsEdit={setEditStep}
              />
            )
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button onClick={() => addStep()}>Add step</Button>
      </CardActions>
    </Card>
  );
}
