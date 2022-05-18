import {
  LOAD_STATUS_FAILURE,
  LOAD_STATUS_REQUEST,
  LOAD_STATUS_SUCCESS,
  StatusState,
  StatusTypes,
} from "./statusTypes";

export const initialStatusState: StatusState = {
  loading: false,
  error: undefined,
  isOn: false,
  profileId: 0,
  profileStepIndex: 0,
  stepTime: 0,
  oven: 0,
  chip: 0,
  fault: 0,
  faultText: [],
};

export function StatusReducer(
  state = initialStatusState,
  action: StatusTypes
): StatusState {
  switch (action.type) {
    case LOAD_STATUS_REQUEST:
      return { ...state, loading: true };

    case LOAD_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        ...action.payload,
      };

    case LOAD_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };

    default:
      return state;
  }
}
