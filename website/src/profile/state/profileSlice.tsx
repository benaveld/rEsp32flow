import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialProfileStep, Profile, ProfileStep } from "../profileTypes";

interface ProfileState {
  editingProfileStep?: ProfileStep;
}

const initialState: ProfileState = {};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
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

export const { addProfileStep, editProfileStep, stopEditingProfileStep } = profileSlice.actions;
