import { baseUrl } from "../config";

const url = baseUrl + "/api/status.json";

export interface StatusResponse {
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
  async get(): Promise<StatusResponse> {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) return await response.json();
    throw new Error(response.status + ": " + response.statusText);
  },
};

export default StatusApi;
