
export const LOAD_STATUS_REQUEST = "LOAD_STATUS_REQUEST";
export const LOAD_STATUS_SUCCESS = "LOAD_STATUS_SUCCESS";
export const LOAD_STATUS_FAILURE = "LOAD_STATUS_FAILURE";

interface LoadStatusRequest {
  type: typeof LOAD_STATUS_REQUEST;
}

interface LoadStatusSuccess {
  type: typeof LOAD_STATUS_SUCCESS;
  payload: Omit<StatusState, "loading" | "error" | "history">;
}

interface LoadStatusFailure {
  type: typeof LOAD_STATUS_FAILURE;
  payload: {
    message: string;
  };
}
export type StatusTypes =
  | LoadStatusRequest
  | LoadStatusSuccess
  | LoadStatusFailure;

export interface StatusState {
  loading: boolean;
  error: string | undefined;
  isOn: boolean;
  profileId: number;
  profileStepIndex: number;
  stepTime: number;
  oven: number;
  chip: number;
  uptime: number; // milliseconds since start-up
  history: {
    uptime: number;
    oven: number;
    chip: number;
  }[];
  fault: number;
  faultText: string[];
}
