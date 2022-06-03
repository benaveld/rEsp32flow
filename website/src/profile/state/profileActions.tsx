import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../errorUtils";
import { Profile } from "../profile";
import ProfileApi from "../profileApi";
import { ProfileStep } from "../profileStep";

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
  async (props: {profile: Profile, step?: ProfileStep, stepIndex?: number}, { rejectWithValue }) => {
    const {profile, step, stepIndex} = props;
    try {
      return await ProfileApi.put(profile, step, stepIndex);
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profile/delete",
  async (
    props: { profile: Profile; stepIndex?: number },
    { rejectWithValue }
  ) => {
    try {
      await ProfileApi.delete(props.profile, props.stepIndex);
      return props;
    } catch (e) {
      return rejectWithValue(getErrorMessage(e));
    }
  }
);
