import { baseUrl } from "../config";

const url = baseUrl + "/api/relay.json";

const RelayApi = {
  async put(body: any) {
    const response = await fetch(url, {
      mode: "cors",
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) return await response.json();
    return new Error(response.status + ": " + response.statusText);
  },
};

export default RelayApi;
