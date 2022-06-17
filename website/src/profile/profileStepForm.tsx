import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardProps,
  Grid,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { ProfileStep } from "./profileStep";
import { saveProfileStep } from "./state/profileActions";
import { stopEditingProfileStep } from "./state/profileSlice";

type ProfileStepFormProps = Omit<CardProps, "component" | "onSubmit">;

export const ProfileStepForm = (props: ProfileStepFormProps) => {
  const { profile, stepIndex, ...editingProfile } = useAppSelector(
    (appState) => appState.profileState.editingProfileStep!
  );
  const [step, setStep] = useState(editingProfile.step);
  const dispatch = useAppDispatch();

  const handleChange =
    (prop: keyof ProfileStep) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStep({ ...step, [prop]: event.target.value });
    };

  function isValid() {
    return step.timer >= 0;
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!isValid()) return;
    await dispatch(saveProfileStep({ profile, step, stepIndex }));
    dispatch(stopEditingProfileStep());
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(stopEditingProfileStep());
  };

  const commonTextFieldValues = {
    variant: "standard",
    type: "number",
    fullWidth: true,
  } as TextFieldProps;

  return (
    <Card
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      {...props}
    >
      <CardContent>
        <Grid container spacing={1} columns={6}>
          <Grid item xs={3}>
            <TextField
              {...commonTextFieldValues}
              label="Temperature"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">°C</InputAdornment>
                ),
              }}
              value={step.temperature}
              onChange={handleChange("temperature")}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              {...commonTextFieldValues}
              label="timer"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">sec</InputAdornment>
                ),
              }}
              value={step.timer}
              onChange={handleChange("timer")}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              {...commonTextFieldValues}
              label="Kp"
              value={step.Kp}
              onChange={handleChange("Kp")}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              {...commonTextFieldValues}
              label="Ki"
              value={step.Ki}
              onChange={handleChange("Ki")}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              {...commonTextFieldValues}
              label="Kd"
              value={step.Kd}
              onChange={handleChange("Kd")}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button type="submit">Save</Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </CardActions>
    </Card>
  );
};
