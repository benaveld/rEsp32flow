import { baseUrl } from "../config";
import { Profile } from "./profile";
import { EditProfileStep } from "./state/profileTypes";

const url = baseUrl + "/api/profiles.json";

const ProfileApi = {
  async get(): Promise<Profile[]> {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) return await response.json();
    throw new Error(response.statusText);
  },

  async put(profile: Profile): Promise<Profile> {
    const requestUrl = url + "?id=" + profile.id;
    const response = await fetch(requestUrl, {
      method: "PUT",
      body: JSON.stringify(profile),
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    });

    if (response.ok) return profile;
    throw new Error(response.statusText);
  },

  async putStep(props: EditProfileStep) {
    const { profile, step, stepIndex } = props;
    const requestUrl = url + "?id=" + profile.id + "&stepId=" + stepIndex;

    if (stepIndex > profile.steps.length || stepIndex < 0)
      throw new Error("stepIndex out of range");

    const steps =
      profile.steps.length === stepIndex
        ? profile.steps.concat(step)
        : profile.steps.map((old, i) => (i === stepIndex ? step : old));

    const response = await fetch(requestUrl, {
      method: "PUT",
      body: JSON.stringify(step),
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    });

    if (response.ok) return { ...profile, steps } as Profile;
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
    if (response.ok) return;
    throw new Error(response.statusText);
  },
};

export default ProfileApi;
