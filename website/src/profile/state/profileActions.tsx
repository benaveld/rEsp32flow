import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Profile } from "../profile";
import ProfileApi from "../profileApi";
import { ProfileStep } from "../profileStep";
import {
  DELETE_PROFILE_FAILURE,
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  EDIT_PROFILE_STEP,
  LOAD_PROFILE_FAILURE,
  LOAD_PROFILE_REQUEST,
  LOAD_PROFILE_SUCCESS,
  ProfileState,
  SAVE_PROFILE_FAILURE,
  SAVE_PROFILE_REQUEST,
  SAVE_PROFILE_SUCCESS,
} from "./profileTypes";

export function loadProfiles(): ThunkAction<
  void,
  ProfileState,
  null,
  Action<string>
> {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_PROFILE_REQUEST });
    try {
      const response = await ProfileApi.get();
      return dispatch({
        type: LOAD_PROFILE_SUCCESS,
        payload: response,
      });
    } catch (e) {
      return dispatch({ type: LOAD_PROFILE_FAILURE, payload: e });
    }
  };
}

export function saveProfile(
  profile: Profile,
  step?: ProfileStep,
  stepIndex?: number
): ThunkAction<void, ProfileState, null, Action<string>> {
  return async (dispatch: any) => {
    dispatch({ type: SAVE_PROFILE_REQUEST });
    try {
      if (stepIndex !== undefined && step !== undefined) {
        profile.steps[stepIndex] = step;
      }
      const response = await ProfileApi.put(profile, step, stepIndex);
      return dispatch({
        type: SAVE_PROFILE_SUCCESS,
        payload: response,
      });
    } catch (e) {
      return dispatch({ type: SAVE_PROFILE_FAILURE, payload: e });
    }
  };
}

export function deleteProfile(
  profile: Profile,
  stepIndex?: number
): ThunkAction<void, ProfileState, null, Action<string>> {
  return async (dispatch: any) => {
    dispatch({ type: DELETE_PROFILE_REQUEST });
    try {
      const response = await ProfileApi.delete(profile, stepIndex);
      return dispatch({
        type: DELETE_PROFILE_SUCCESS,
        payload: { profileId: profile.id, stepIndex, response },
      });
    } catch (e) {
      return dispatch({ type: DELETE_PROFILE_FAILURE, payload: e });
    }
  };
}

export function editProfileStep(
  profile: Profile,
  step: ProfileStep,
  stepIndex?: number
): ThunkAction<void, ProfileState, null, Action<string>> {
  return async (dispatch: any) => {
    dispatch({
      type: EDIT_PROFILE_STEP,
      payload: { profile, step, stepIndex: stepIndex ?? profile.steps.length },
    });
  };
}

export function stopEditingProfileStep(): ThunkAction<
  void,
  ProfileState,
  null,
  Action<string>
> {
  return async (dispatch: any) => {
    dispatch({
      type: EDIT_PROFILE_STEP,
      payload: undefined,
    });
  };
}
