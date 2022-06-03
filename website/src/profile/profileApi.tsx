import { baseUrl } from "../config";
import { Profile } from "./profile";
import { ProfileStep } from "./profileStep";

const url = baseUrl + "/api/profiles.json";

const ProfileApi = {
  async get(): Promise<Profile[]> {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) return await response.json();
    throw new Error(response.statusText);
  },

  async put(
    profile: Profile,
    step?: ProfileStep,
    stepIndex?: number
  ): Promise<Profile> {
    let requestUrl = url + "?id=" + profile.id;
    if (step !== undefined && stepIndex !== undefined) {
      requestUrl += "&stepId=" + stepIndex;
    }

    const response = await fetch(requestUrl, {
      method: "PUT",
      body: JSON.stringify(step ?? profile),
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    });

    if (step !== undefined && stepIndex !== undefined) {
      if (stepIndex === profile.steps.length) {
        profile.steps = profile.steps.concat(step);
      } else {
        profile.steps[stepIndex] = step;
      }
    }

    if (response.ok) return profile;
    throw new Error(response.statusText);
  },

  async delete(profile: Profile, stepIndex?: number) {
    let requestUrl = url + "?id=" + profile.id;
    if (stepIndex !== undefined) {
      requestUrl += "&stepId=" + stepIndex;
    }

    const response = await fetch(requestUrl, {
      method: "DELETE",
      mode: "cors",
    });
    if (response.ok) return null;
    throw new Error(response.statusText);
  },
};

export default ProfileApi;
