import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { Profile } from "../profile";
import ProfileApi from "../profileApi";
import { ProfileStep } from "../profileStep";
import {
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
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
      dispatch({ type: LOAD_PROFILE_FAILURE, payload: e });
    }
  };
}

export function saveProfile(
  profile: Profile,
  step?: ProfileStep
): ThunkAction<void, ProfileState, null, Action<string>> {
  return async (dispatch: any) => {
    dispatch({ type: SAVE_PROFILE_REQUEST });
    try {
      const response = await ProfileApi.put(profile, step);
      return dispatch({
        type: SAVE_PROFILE_SUCCESS,
        payload: response,
      });
    } catch (e) {
      dispatch({ type: SAVE_PROFILE_FAILURE, payload: e });
    }
  };
}

export function deleteProfile(
  profile: Profile,
  step?: ProfileStep
): ThunkAction<void, ProfileState, null, Action<string>> {
  return async (dispatch: any) => {
    dispatch({ type: DELETE_PROFILE_REQUEST });
    try {
      const response = await ProfileApi.delete(profile, step);
      return dispatch({
        type: DELETE_PROFILE_SUCCESS,
        payload: response,
      });
    } catch (e) {
      dispatch({ type: DELETE_PROFILE_REQUEST, payload: e });
    }
  };
}