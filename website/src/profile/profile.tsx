import { ProfileStep } from "./profileStep";

export interface Profile {
  id: number;
  name: string;
  steps: ProfileStep[];
}

export function getUniqId(profiles: Profile[]) {
  let id = 0;
  const idCheck = (id: number) => (v: Profile) => v.id === id;
  while (profiles.find(idCheck(id)) !== undefined) {
    id++;
  }
  return id;
}