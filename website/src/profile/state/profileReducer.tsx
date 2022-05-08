import { merge } from "../../myUtils";
import { Profile } from "../profile";
import {
  DELETE_PROFILE_FAILURE,
  DELETE_PROFILE_REQUEST,
  DELETE_PROFILE_SUCCESS,
  LOAD_PROFILE_FAILURE,
  LOAD_PROFILE_REQUEST,
  LOAD_PROFILE_SUCCESS,
  ProfileState,
  ProfileTypes,
  SAVE_PROFILE_FAILURE,
  SAVE_PROFILE_REQUEST,
  SAVE_PROFILE_SUCCESS,
} from "./profileTypes";

export const initialProfileState: ProfileState = {
  loading: false,
  profiles: [],
  error: undefined,
};

export function ProfileReducer(
  state = initialProfileState,
  action: ProfileTypes
): ProfileState {
  switch (action.type) {
    case LOAD_PROFILE_REQUEST:
      return { ...state, loading: true };

    case LOAD_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profiles: action.payload,
        error: undefined,
      };

    case LOAD_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SAVE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case SAVE_PROFILE_SUCCESS:
      const id = state.profiles.findIndex(
        (value) => value.id === action.payload.id
      );

      let updatedProfiles = state.profiles;
      if (id >= 0) {
        updatedProfiles[id] = action.payload;
      } else {
        updatedProfiles = merge([updatedProfiles, [action.payload]]);
      }

      return {
        ...state,
        loading: false,
        profiles: updatedProfiles,
        error: undefined,
      };

    case SAVE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_PROFILE_SUCCESS:
      let profiles: Profile[];
      if (action.payload.stepId === undefined) {
        profiles = state.profiles.filter(
          (value) => value.id !== action.payload.profileId
        );
      } else {
        let newProfile = state.profiles.find(
          (value) => value.id === action.payload.profileId
        );
        newProfile!.steps = newProfile!.steps.filter(
          (value) => value.id !== action.payload.stepId
        );
        profiles = state.profiles.map((value) =>
          value.id === newProfile!.id ? newProfile! : value
        );
      }
      return {
        ...state,
        loading: false,
        profiles,
        error: undefined,
      };

    case DELETE_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
