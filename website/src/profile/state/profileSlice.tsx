import {
  createSlice,
  isAnyOf,
  isPending,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import { deleteProfile, loadProfiles, saveProfile, saveProfileStep } from "./profileActions";
import { EditProfileStep, ProfileState } from "./profileTypes";

const initialState = {
  loading: false,
  profiles: [],
  error: undefined,
} as ProfileState;

type editProfileStepParam = PayloadAction<
  { stepIndex?: number } & Omit<EditProfileStep, "stepIndex">
>;

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    editProfileStep(state, action: editProfileStepParam) {
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

  extraReducers: (builder) => {

    // Load Profiles
    builder.addCase(loadProfiles.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.profiles = action.payload;
    });

    // Delete Profile
    builder.addCase(deleteProfile.fulfilled, (state, action) => {
      const { profile, stepIndex } = action.payload;
      state.loading = false;
      state.error = undefined;

      if (stepIndex === undefined) {
        state.profiles = state.profiles.filter(
          (value) => value.id !== profile.id
        );
        return;
      }

      const steps = profile.steps.filter((_, index) => index !== stepIndex);
      state.profiles = state.profiles.map((value) =>
        value.id === profile.id ? { ...value, steps } : value
      );
    });

    // Save Profile
    builder.addMatcher(isAnyOf(saveProfile.fulfilled, saveProfileStep.fulfilled), (state, action) => {
      state.loading = false;
      state.error = undefined;

      const index = state.profiles.findIndex(
        (value) => value.id === action.payload.id
      );

      if (index >= 0) {
        state.profiles = state.profiles.map((value, i) => index === i ? action.payload : value);
      } else {
        state.profiles = state.profiles.concat(action.payload);
      }
    });

    // Loading
    builder.addMatcher(isPending, (state) => {
      state.loading = true;
    });

    // Handle Rejection
    builder.addMatcher(isRejectedWithValue, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { editProfileStep, stopEditingProfileStep } = profileSlice.actions;
export default profileSlice;
