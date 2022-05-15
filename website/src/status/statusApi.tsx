import { baseUrl } from "../config";

const url = baseUrl + "/api/status.json";

const StatusApi = {
  async get() {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) return await response.json();
    return new Error(response.status + ": " + response.statusText);
  },
};

export default StatusApi;
