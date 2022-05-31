import { StatusResponse } from "../statusApi";

export const LOAD_STATUS_REQUEST = "LOAD_STATUS_REQUEST";
export const LOAD_STATUS_SUCCESS = "LOAD_STATUS_SUCCESS";
export const LOAD_STATUS_FAILURE = "LOAD_STATUS_FAILURE";

interface LoadStatusRequest {
  type: typeof LOAD_STATUS_REQUEST;
}

interface LoadStatusSuccess {
  type: typeof LOAD_STATUS_SUCCESS;
  payload: StatusResponse;
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

export type StatusState = StatusResponse & {
  loading: boolean;
  error: string | undefined;
  history: {
    uptime: number;
    oven: number;
    chip: number;
  }[];
}
