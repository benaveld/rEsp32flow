import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ProfileStep } from "../profileTypes";

interface ProfileState {
  editingProfileStep?: ProfileStep;
}

const initialState: ProfileState = {}

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    editProfileStep(state, action: PayloadAction<ProfileStep>) {
      state.editingProfileStep = action.payload;
    },

    stopEditingProfileStep(state) {
      state.editingProfileStep = undefined;
    },
  },
});

export const { editProfileStep, stopEditingProfileStep } = profileSlice.actions;
