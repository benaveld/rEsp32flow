export interface ProfileStep {
  id: number;
  profileId: Profile["id"];
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

export interface Profile {
  id: number;
  name: string;
  steps: ProfileStep[];
}

export function getUniqId(profiles: Profile[]) {
  let id: Profile["id"] = (profiles.at(-1)?.id ?? -1) + 1;

  const idCheck = (id: Profile["id"]) => (profile: Profile) =>
    profile.id === id;

  while (profiles.find(idCheck(id)) !== undefined) id++;

  return id;
}
