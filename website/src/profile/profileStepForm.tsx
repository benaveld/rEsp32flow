import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { ProfileStep } from "./profileStep";

interface ProfileStepFormProps {
  index: number;
  step: ProfileStep;
  onEdit: (step: ProfileStep, index: number) => void;
  setIsEdit: (key?: React.Key) => void;
}

export function ProfileStepForm(props: ProfileStepFormProps) {
  const { onEdit, setIsEdit, index } = props;
  const [step, setStep] = useState(props.step);

  const handleChange =
    (prop: keyof ProfileStep) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStep({ ...step, [prop]: event.target.value });
    };

  function isValid() {
    return step.timer >= 0;
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!isValid()) return;
    onEdit(step, index);
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    setIsEdit(undefined);
  };

  return (
    <Card
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <CardContent>
        <Grid container spacing={1} columns={6}>
          <Grid item xs={3}>
            <TextField
              variant="standard"
              label="temperature"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">°C</InputAdornment>
                ),
              }}
              fullWidth={true}
              value={step.temperature}
              onChange={handleChange("temperature")}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="standard"
              label="timer"
              type="number"
              fullWidth={true}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ms</InputAdornment>
                ),
              }}
              value={step.timer}
              onChange={handleChange("timer")}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="standard"
              label="Kp"
              type="number"
              fullWidth={true}
              value={step.Kp}
              onChange={handleChange("Kp")}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="standard"
              label="Ki"
              type="number"
              fullWidth={true}
              value={step.Ki}
              onChange={handleChange("Ki")}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="standard"
              label="Kd"
              type="number"
              fullWidth={true}
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
}
