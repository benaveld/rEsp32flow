import { merge } from "../../myUtils";
import {
  LOAD_STATUS_FAILURE,
  LOAD_STATUS_REQUEST,
  LOAD_STATUS_SUCCESS,
  StatusState,
  StatusTypes,
} from "./statusTypes";

const keepHistoryTime = 10 * 60 * 1000; // 10 min in ms

export const initialStatusState: StatusState = {
  loading: false,
  error: undefined,
  isOn: false,
  profileId: 0,
  profileStepIndex: 0,
  stepTime: 0,
  oven: 0,
  chip: 0,
  uptime: 0,
  history: [],
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
      if (action.payload.uptime === 0 || action.payload.oven === null) {
        return { ...state, loading: false, error: undefined };
      }
      return {
        ...state,
        loading: false,
        error: undefined,
        ...action.payload,
        history: merge([
          state.history,
          [
            {
              uptime: action.payload.uptime,
              oven: action.payload.oven,
              chip: action.payload.chip,
            },
          ],
        ]).filter(value => action.payload.uptime - keepHistoryTime <= value.uptime),
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
