import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../errorUtils";
import { Profile } from "../profile";
import ProfileApi from "../profileApi";
import { EditProfileStepState } from "./profileSlice";

export const loadProfiles = createAsyncThunk(
  "profile/load",
  async (_, { rejectWithValue }) => {
    try {
      return await ProfileApi.get();
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);

export const saveProfile = createAsyncThunk(
  "profile/save",
  async (profile: Profile, { rejectWithValue }) => {
    try {
      return await ProfileApi.put(profile);
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);

export const saveProfileStep = createAsyncThunk(
  "profile/step/save",
  async (props: EditProfileStepState, { rejectWithValue }) => {
    try {
      return await ProfileApi.putStep(props);
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profile/delete",
  async (profileId: number, { rejectWithValue }) => {
    try {
      await ProfileApi.delete(profileId);
      return profileId;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);

export const deleteProfileStep = createAsyncThunk(
  "profile/step/delete",
  async (
    props: { profile: Profile; stepIndex: number },
    { rejectWithValue }
  ) => {
    try {
      const { profile, stepIndex } = props;
      await ProfileApi.deleteStep(props.profile, props.stepIndex);
      return {
        ...profile,
        steps: profile.steps.filter((_, index) => index !== stepIndex),
      } as Profile;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);
