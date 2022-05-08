import { merge } from "../../myUtils";
import {
  LOAD_TEMPERATURE_FAILURE,
  LOAD_TEMPERATURE_REQUEST,
  LOAD_TEMPERATURE_SUCCESS,
  TemperatureState,
  TemperatureTypes,
} from "./temperatureTypes";

const maxHistoryLength = 60*5;

export const initialTemperatureState: TemperatureState = {
  loading: false,
  oven: 0,
  chip: 0,
  ovenHistory: [],
  chipHistory: [],
  fault: 0,
  precision: 1,
  historySampleRate: 1000,
  error: undefined,
};

export function TemperatureReducer(
  state = initialTemperatureState,
  action: TemperatureTypes
) {
  switch (action.type) {
    case LOAD_TEMPERATURE_REQUEST:
      return { ...state, loading: true };

    case LOAD_TEMPERATURE_SUCCESS:
      const { oven, chip } = action.payload;
      const ovenHistory = merge([
        state.ovenHistory,
        action.payload.ovenHistory,
      ]).slice(-maxHistoryLength);
      const chipHistory = merge([
        state.chipHistory,
        action.payload.chipHistory,
      ]).slice(-maxHistoryLength);

      return {
        ...state,
        loading: false,
        oven,
        chip,
        ovenHistory,
        chipHistory,
        error: undefined,
      };

    case LOAD_TEMPERATURE_FAILURE:
      return { ...state, loading: false, error: action.payload.message };

    default:
      return state;
  }
}
