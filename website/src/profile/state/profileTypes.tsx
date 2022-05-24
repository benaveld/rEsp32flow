import { Profile } from "../profile";
import { ProfileStep } from "../profileStep";

export const LOAD_PROFILE_REQUEST = "LOAD_PROFILE_REQUEST";
export const LOAD_PROFILE_SUCCESS = "LOAD_PROFILE_SUCCESS";
export const LOAD_PROFILE_FAILURE = "LOAD_PROFILE_FAILURE";
export const SAVE_PROFILE_REQUEST = "SAVE_PROFILE_REQUEST";
export const SAVE_PROFILE_SUCCESS = "SAVE_PROFILE_SUCCESS";
export const SAVE_PROFILE_FAILURE = "SAVE_PROFILE_FAILURE";
export const DELETE_PROFILE_REQUEST = "DELETE_PROFILE_REQUEST";
export const DELETE_PROFILE_SUCCESS = "DELETE_PROFILE_SUCCESS";
export const DELETE_PROFILE_FAILURE = "DELETE_PROFILE_FAILURE";
export const EDIT_PROFILE_STEP = "EDIT_PROFILE_STEP";

interface LoadProfileRequest {
  type: typeof LOAD_PROFILE_REQUEST;
}

interface LoadProfileSuccess {
  type: typeof LOAD_PROFILE_SUCCESS;
  payload: Profile[];
}

interface LoadProfileFailure {
  type: typeof LOAD_PROFILE_FAILURE;
  payload: {
    message: string;
  };
}

interface SaveProfileRequest {
  type: typeof SAVE_PROFILE_REQUEST;
}

interface SaveProfileSuccess {
  type: typeof SAVE_PROFILE_SUCCESS;
  payload: Profile;
}

interface SaveProfileFailure {
  type: typeof SAVE_PROFILE_FAILURE;
  payload: {
    message: string;
  };
}

interface DeleteProfileRequest {
  type: typeof DELETE_PROFILE_REQUEST;
}

interface DeleteProfileSuccess {
  type: typeof DELETE_PROFILE_SUCCESS;
  payload: {
    profileId: number;
    stepIndex: number | undefined;
    response: any;
  };
}

interface DeleteProfileFailure {
  type: typeof DELETE_PROFILE_FAILURE;
  payload: {
    message: string;
  };
}

interface EditProfileStep {
  profile: Profile;
  stepIndex: number;
  step: ProfileStep;
}

interface EditProfileStepAction {
  type: typeof EDIT_PROFILE_STEP;
  payload?: EditProfileStep;
}

export type ProfileTypes =
  | LoadProfileRequest
  | LoadProfileSuccess
  | LoadProfileFailure
  | SaveProfileRequest
  | SaveProfileSuccess
  | SaveProfileFailure
  | DeleteProfileRequest
  | DeleteProfileSuccess
  | DeleteProfileFailure
  | EditProfileStepAction;

export interface ProfileState {
  loading: boolean;
  profiles: Profile[];
  editingProfileStep?: EditProfileStep;
  error?: string;
}
