import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../state";
import { initialProfileStep, Profile, ProfileStep } from "../profileTypes";

interface EditProfileState {
  editingProfileStep?: ProfileStep;
}

const initialState: EditProfileState = {};

export const profileSlice = createSlice({
  name: "editProfile",
  initialState,
  reducers: {
    addProfileStep(state, action: PayloadAction<Profile>) {
      const profile = action.payload;
      let id = 0;
      profile.steps.forEach((_, key) => {
        if (key > id) id = key;
      });

      state.editingProfileStep = {
        ...initialProfileStep,
        profileId: profile.id,
        id,
      };
    },

    editProfileStep(state, action: PayloadAction<ProfileStep>) {
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
