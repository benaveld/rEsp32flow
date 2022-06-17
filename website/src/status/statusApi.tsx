import { baseUrl, requestMode } from "../config";

export const statusApiUrl = baseUrl + "/api/status.json";

export interface StatusGetResponse {
  isOn: boolean;
  profileId: number;
  profileStepIndex: number;
  stepTime: number;
  relayOnTime: number;
  updateRate: number;
  oven: number;
  chip: number;
  uptime: number; // milliseconds since start-up
  fault: number;
  faultText: string[];
}

const StatusApi = {
  async get(): Promise<StatusGetResponse | never> {
    const response = await fetch(statusApiUrl, { mode: requestMode});
    if (response.ok) return await response.json();
    throw new Error(response.status + ": " + response.statusText);
  },
};

export default StatusApi;
