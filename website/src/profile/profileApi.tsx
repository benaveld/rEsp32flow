import { baseUrl } from "../config";
import { Profile } from "./profile";
import { ProfileStep } from "./profileStep";

const url = baseUrl + "/api/profiles.json";

const ProfileApi = {
  async get() : Promise<Profile[] | Error>{
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) return await response.json();
    return new Error(response.statusText);
  },

  async put(profile: Profile, step?: ProfileStep) {
    let requestUrl = url + "?id=" + profile.id;
    if (step !== undefined) {
      requestUrl += "&stepId=" + step.id;
    }

    const response = await fetch(requestUrl, {
      method: "PUT",
      body: JSON.stringify(step !== undefined ? profile : step),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) return await response.json();
    return new Error(response.statusText);
  },

  async delete(profile: Profile, step?: ProfileStep) {
    let requestUrl = url + "?id=" + profile.id;
    if (step !== undefined) {
      requestUrl += "&stepId=" + step.id;
    }

    const response = await fetch(requestUrl, {
      method: "DELETE",
    });
    if (response.ok) return await response.json();
    return new Error(response.statusText);
  },
};

export default ProfileApi;
