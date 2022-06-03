import { baseUrl } from "../config";

const url = baseUrl + "/api/relay.json";

interface RelayPutParams {
  stop?: boolean;
  profileId?: number;
}

const RelayApi = {
  async put(body: RelayPutParams) {
    const response = await fetch(url, {
      mode: "cors",
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) return;
    throw new Error(response.status + ": " + response.statusText);
  },
};

export default RelayApi;
