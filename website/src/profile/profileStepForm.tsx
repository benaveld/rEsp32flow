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
import { usePutProfileStepMutation } from "./profileApi";
import { ProfileStep } from "./profileTypes";
import {
  selectEditingProfileStep,
  stopEditingProfileStep,
} from "./state/profileSlice";

export type ProfileStepFormProps = Omit<CardProps, "component" | "onSubmit">;

export const ProfileStepForm = (props: ProfileStepFormProps) => {
  const editingProfileStep = useAppSelector(selectEditingProfileStep);
  if (editingProfileStep === undefined)
    throw new Error(
      "Can't render ProfileStepForm if editingProfileStep is undefined."
    );

  const [step, setStep] = useState(editingProfileStep);
  const dispatch = useAppDispatch();
  const [putProfileStep] = usePutProfileStepMutation();

  const handleChange =
    (prop: keyof typeof step): TextFieldProps["onChange"] =>
    (event) => {
      setStep((oldStep) => ({ ...oldStep, [prop]: event.target.value }));
    };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!isValid(step)) return;

    putProfileStep({ step });
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
              error={step.timer < 0}
              helperText="Can't be negative."
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              {...commonTextFieldValues}
              label="Kp"
              value={step.Kp}
              onChange={handleChange("Kp")}
              error={step.Kp <= 0}
              helperText="Must be greater then 0."
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              {...commonTextFieldValues}
              label="Ki"
              value={step.Ki}
              onChange={handleChange("Ki")}
              error={step.Ki <= 0}
              helperText="Must be greater then 0."
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              {...commonTextFieldValues}
              label="Kd"
              value={step.Kd}
              onChange={handleChange("Kd")}
              error={step.Kd < 0}
              helperText="Can't be negative."
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ flexDirection: "row-reverse" }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button type="submit">Save</Button>
      </CardActions>
    </Card>
  );
};

const isValid = (step: ProfileStep) =>
  step.timer >= 0 && step.Kp > 0 && step.Ki > 0 && step.Kd >= 0;
