import { baseUrl, requestMode } from "../config";

const url = baseUrl + "/api/temperature.json";

export interface HistoryGetResponse {
  historySampleRate: number;
  history: [
    {
      uptime: number;
      oven: number;
      chip: number;
    }
  ];
}

const HistoryApi = {
  async get(timeBack: number): Promise<HistoryGetResponse | null> {
    const response = await fetch(url + "?timeBack=" + timeBack, {
      mode: requestMode,
    });
    if (response.ok) return await response.json();
    throw new Error(response.status + ": " + response.statusText);
  },
};

export default HistoryApi;
