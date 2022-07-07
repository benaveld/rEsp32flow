import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../state";
import { Profile, ProfileStep } from "../profileTypes";

type EditingProfileStep = ProfileStep;

const initialProfileStep = {
  timer: 0,
  temperature: 0,
  Kp: 1,
  Ki: 1,
  Kd: 0,
} as EditingProfileStep;

interface EditProfileState {
  editingProfileStep?: EditingProfileStep;
}

const initialState: EditProfileState = {};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfileStep(state, action: PayloadAction<Profile>) {
      const profile = action.payload;
      let id = 0;
      profile.steps.forEach((step) => {
        if (step.id >= id) id = step.id + 1;
      });

      state.editingProfileStep = {
        ...initialProfileStep,
        profileId: profile.id,
        id,
      };
    },

    editProfileStep(state, action: PayloadAction<EditingProfileStep>) {
      state.editingProfileStep = action.payload;
    },

    stopEditingProfileStep(state) {
      state.editingProfileStep = undefined;
    },
  },
});

export const selectEditingProfileStep = (state: AppState) =>
  state[profileSlice.name].editingProfileStep;
export const selectEditingProfileStepsId = (state: AppState) =>
  selectEditingProfileStep(state)?.id;
export const { addProfileStep, editProfileStep, stopEditingProfileStep } =
  profileSlice.actions;
