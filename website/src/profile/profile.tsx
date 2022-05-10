import { ProfileStep } from "./profileStep";

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
export function getUniqId(profiles: Profile[]): number {
  let id = 0;
  profiles.forEach((value) => {
    if (value.id === id) {
      id++;
    }
  });
  return id;
}