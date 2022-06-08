import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../errorUtils";
import { Profile } from "../profile";
import ProfileApi from "../profileApi";
import { EditProfileStep } from "./profileTypes";

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
  async (props: EditProfileStep, { rejectWithValue }) => {
    try {
      return await ProfileApi.putStep(props);
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
