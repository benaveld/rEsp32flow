import {
  createEntityAdapter,
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Profile } from "../profile";
import { ProfileStep } from "../profileStep";
import {
  deleteProfile,
  deleteProfileStep,
  loadProfiles,
  saveProfile,
  saveProfileStep,
} from "./profileActions";

export interface EditProfileStepState {
  profile: Profile;
  stepIndex: number;
  step: ProfileStep;
}

interface PartialProfileState {
  loading: boolean;
  editingProfileStep?: EditProfileStepState;
  error?: string;
}

type EditProfileStepParam = { stepIndex?: number } & Omit<
  EditProfileStepState,
  "stepIndex"
>;

const profilesAdapter = createEntityAdapter<Profile>({
  selectId: (profile) => profile.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const profileSlice = createSlice({
  name: "profile",
  initialState: profilesAdapter.getInitialState({
    loading: false,
    error: undefined,
  } as PartialProfileState),
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

  extraReducers: (builder) => {
    // Load Profiles
    builder.addCase(loadProfiles.fulfilled, profilesAdapter.setAll);

    // Delete Profile
    builder.addCase(deleteProfile.fulfilled, profilesAdapter.removeOne);
    builder.addCase(deleteProfileStep.fulfilled, profilesAdapter.setOne);

    // Save Profile
    builder.addMatcher(
      isAnyOf(saveProfile.fulfilled, saveProfileStep.fulfilled),
      profilesAdapter.setOne
    );

    // Loading
    builder.addMatcher(isPending, (state) => {
      state.loading = true;
    });

    // Handle Rejection
    builder.addMatcher(isRejectedWithValue, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addMatcher(isFulfilled, (state, _) => {
      state.loading = false;
      state.error = undefined;
    });
  },
});

export const profilesSelectors = profilesAdapter.getSelectors();
export const { editProfileStep, stopEditingProfileStep } = profileSlice.actions;
export default profileSlice;
