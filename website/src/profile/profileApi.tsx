import { baseUrl } from "../config";
import { Profile } from "./profile";
import { EditProfileStepState } from "./state/profileSlice";

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

  async putStep(props: EditProfileStepState) {
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

  async delete(profileId: number) {
    const requestUrl = url + "?id=" + profileId;

    const response = await fetch(requestUrl, {
      method: "DELETE",
      mode: "cors",
    });
    if (response.ok) return;
    throw new Error(response.statusText);   
  },

  async deleteStep(profile: Profile, stepIndex: number) {
    const requestUrl = url + "?id=" + profile.id +"&stepId=" + stepIndex;

    const response = await fetch(requestUrl, {
      method: "DELETE",
      mode: "cors",
    });
    if (response.ok) return;
    throw new Error(response.statusText);
  },
};

export default ProfileApi;
