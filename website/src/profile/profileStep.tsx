import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";

export class ProfileStep {
  id: number = 0;
  timer: number = 0;
  temperature: number = 0;
  Kp: number = 0;
  Ki: number = 0;
  Kd: number = 0;

  constructor(initializer?: any) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.timer) this.timer = initializer.timer;
    if (initializer.temperature) this.temperature = initializer.temperature;
    if (initializer.Kp) this.Kp = initializer.Kp;
    if (initializer.Ki) this.Ki = initializer.Ki;
    if (initializer.Kd) this.Kd = initializer.Kd;
  }
}

interface ProfileStepViewProps {
  step: ProfileStep;
  setIsEdit: (step: ProfileStep) => void;
}

export function ProfileStepView(props: ProfileStepViewProps) {
  const { step, setIsEdit } = props;
  return (
    <Card>
      <CardContent>
        <Grid container spacing={1} columns={6}>
          <Grid item xs={3}>
            <Typography>Target: {step.temperature}°C</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>Timer: {step.timer}ms</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Kp: {step.Kp}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Ki: {step.Ki}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Kd: {step.Kd}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button onClick={() => setIsEdit(step)}></Button>
      </CardActions>
    </Card>
  );
}

interface ProfileStepFormProps {
  step: ProfileStep;
  onEdit: (step: ProfileStep) => void;
  setIsEdit: (step: ProfileStep | undefined) => void;
}

export function ProfileStepForm(props: ProfileStepFormProps) {
  const { onEdit, setIsEdit } = props;
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
    onEdit(step);
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    setIsEdit(undefined);
  }

  return (
    <Card
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <CardContent>
        <Grid container spacing={1} columns={6} >
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
              onChange={handleChange('temperature')}
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
              onChange={handleChange('timer')}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="standard"
              label="Kp"
              type="number"
              fullWidth={true}
              value={step.Kp}
              onChange={handleChange('Kp')}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="standard"
              label="Ki"
              type="number"
              fullWidth={true}
              value={step.Ki}
              onChange={handleChange('Ki')}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="standard"
              label="Kd"
              type="number"
              fullWidth={true}
              value={step.Kd}
              onChange={handleChange('Kd')}

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
