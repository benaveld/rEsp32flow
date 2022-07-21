export interface ProfileStep {
  id: number;
  profileId: Profile["id"];
  timer: number;
  temperature: number;
  Kp: number;
  Ki: number;
  Kd: number;
}

export interface Profile {
  id: number;
  name: string;
  steps: ProfileStep[];
}

export const selectProfileStep = (
  profile?: Profile,
  stepId?: ProfileStep["id"]
) =>
  stepId !== undefined
    ? profile?.steps.find((v) => v.id === stepId)
    : undefined;

export const selectRemainingProfileSteps = (
  profile: Profile,
  stepId: ProfileStep["id"]
) => profile.steps.filter((value) => value.id >= stepId);
