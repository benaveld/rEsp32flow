export const LOAD_TEMPERATURE_REQUEST = "LOAD_TEMPERATURE_REQUEST";
export const LOAD_TEMPERATURE_SUCCESS = "LOAD_TEMPERATURE_SUCCESS";
export const LOAD_TEMPERATURE_FAILURE = "LOAD_TEMPERATURE_FAILURE";

interface LoadTemperatureRequest {
  type: typeof LOAD_TEMPERATURE_REQUEST;
}

interface LoadTemperatureSuccess {
  type: typeof LOAD_TEMPERATURE_SUCCESS;
  payload: {
    oven: number;
    chip: number;
    ovenHistory: number[];
    chipHistory: number[];
  };
}

interface LoadTemperatureFailure {
  type: typeof LOAD_TEMPERATURE_FAILURE;
  payload: { message: string };
}

export type TemperatureTypes =
  | LoadTemperatureRequest
  | LoadTemperatureSuccess
  | LoadTemperatureFailure;

export interface TemperatureState {
  loading: boolean;
  oven: number;
  chip: number;
  ovenHistory: number[];
  chipHistory: number[];
  fault: number;
  precision: number;
  historySampleRate: number;
  error: string | undefined;
}
