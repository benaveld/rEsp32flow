import { ProfileStep } from "./profileStep";

export interface Profile {
  id: number;
  name: string;
  steps: ProfileStep[];
}

// This assumes that the profiles are sorted by id.
export function getUniqId(profiles: Profile[]): number {
  let id = 0;
  profiles.forEach((value) => {
    if (value.id === id) {
      id++;
    }
  });
  return id;
}