import { StatusGetResponse } from "../statusApi";

export type StatusState = StatusGetResponse & {
  loading: boolean;
  error: string | undefined;
  history: {
    uptime: number;
    oven: number;
    chip: number;
  }[];
}
