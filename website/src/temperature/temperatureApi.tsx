import { baseUrl } from "../config";
const url = baseUrl + "/api/temperature.json";

const TemperatureApi = {
  async get(historySize = 0) {
    const response = await fetch(url + "?historySize=" + historySize, {mode:'cors'});
    if (response.ok) return await response.json();
    return new Error(response.statusText);
  },
};

export default TemperatureApi;
