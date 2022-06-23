import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Profile } from "../profile";
import { ProfileStep } from "../profileStep";

export interface EditProfileStepState {
  profile: Profile;
  stepIndex: number;
  step: ProfileStep;
}

interface PartialProfileState {
  editingProfileStep?: EditProfileStepState;
}

export type EditProfileStepParam = { stepIndex?: number } & Omit<
  EditProfileStepState,
  "stepIndex"
>;

const profileSlice = createSlice({
  name: "profile",
  initialState: {} as PartialProfileState,
  reducers: {
    editProfileStep(state, action: PayloadAction<EditProfileStepParam>) {
      const stepIndex =
        action.payload.stepIndex ?? action.payload.profile.steps.length;

      state.editingProfileStep = {
        ...action.payload,
        stepIndex,
      };
    },

    stopEditingProfileStep(state) {
      state.editingProfileStep = undefined;
    },
  },
});

export const { editProfileStep, stopEditingProfileStep } = profileSlice.actions;
export default profileSlice;
