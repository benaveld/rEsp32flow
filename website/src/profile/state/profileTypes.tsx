import { Profile } from "../profile";
import { ProfileStep } from "../profileStep";

export interface EditProfileStep {
  profile: Profile;
  stepIndex: number;
  step: ProfileStep;
}

export interface ProfileState {
  loading: boolean;
  profiles: Profile[];
  editingProfileStep?: EditProfileStep;
  error?: string;
}
