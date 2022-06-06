export interface ProfileStep {
  timer: number;
  temperature: number;
  Kp: number;
  Ki: number;
  Kd: number;
}

export const initialProfileStep = {
  timer: 0,
  temperature: 0,
  Kp: 0,
  Ki: 0,
  Kd: 0,
} as ProfileStep;
