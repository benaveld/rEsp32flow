import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { MaybeDrafted } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { MutationLifecycleApi } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query/react";
import { baseApiUrl } from "../config";
import { getErrorMessage } from "../errorUtils";
import { splitAppApi } from "../splitAppApi";
import { Profile, ProfileStep } from "./profileTypes";

const profileUrl = "profiles.json";
export const profileApiUrl = `${baseApiUrl}/${profileUrl}`;

const profileUrlBuilder = (
  profileId?: Profile["id"],
  stepId?: ProfileStep["id"]
) => {
  let result = profileUrl;
  if (profileId === undefined) return result;
  result += `?id=${profileId}`;
  if (stepId === undefined) return result;

  return `${result}&stepId=${stepId}`;
};

const profilesAdapter = createEntityAdapter<Profile>({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
const initialState = profilesAdapter.getInitialState();

const profileApi = splitAppApi.injectEndpoints({
  endpoints: (build) => ({
    getProfiles: build.query<typeof initialState, void>({
      query: () => profileUrlBuilder(),
      transformResponse(response: Profile[]) {
        return profilesAdapter.setAll(
          initialState,
          response.map((v) => ("steps" in v ? v : { ...v, steps: [] }))
        );
      },
      providesTags: ["profiles"],
    }),

    createProfile: build.mutation<void, { name: Profile["name"] }>({
      query: (arg) => ({
        url: profileUrlBuilder(),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: arg,
      }),
      invalidatesTags: ["profiles"],
    }),

    putProfile: build.mutation<void, { profile: Profile }>({
      query: ({ profile }) => ({
        url: profileUrlBuilder(profile.id),
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: profile,
      }),
      onQueryStarted: optimisticUpdateCache((draft, { profile }) =>
        profilesAdapter.setOne(draft, profile)
      ),
    }),

    putProfileStep: build.mutation<void, { step: ProfileStep }>({
      query: ({ step }) => ({
        url: profileUrlBuilder(step.profileId, step.id),
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: step,
      }),
      onQueryStarted: optimisticUpdateCache((draft, { step }) => {
        const { profileId } = step;
        const steps = selectProfileById(draft, profileId)?.steps;
        if (!steps)
          throw new Error(`profile with the id ${profileId} dose not exist!`);

        const editedSteps = steps.find((v) => v.id === step.id)
          ? steps.map((v) => (v.id === step.id ? step : v)) // Update step
          : steps.concat(step).sort((a, b) => a.id - b.id); // Add step

        draft = profilesAdapter.updateOne(draft, {
          id: profileId,
          changes: { steps: editedSteps },
        });
      }),
    }),

    deleteProfile: build.mutation<void, Profile["id"]>({
      query: (id) => ({
        url: profileUrlBuilder(id),
        method: "DELETE",
      }),
      onQueryStarted: optimisticUpdateCache<Profile["id"]>(
        profilesAdapter.removeOne
      ),
    }),

    deleteProfileStep: build.mutation<
      void,
      { profileId: ProfileStep["profileId"]; stepId: ProfileStep["id"] }
    >({
      query: ({ profileId, stepId }) => ({
        url: profileUrlBuilder(profileId, stepId),
        method: "DELETE",
      }),
      onQueryStarted: optimisticUpdateCache((draft, { profileId, stepId }) => {
        const steps = selectProfileById(draft, profileId)?.steps;
        if (!steps)
          throw new Error(`profile with the id ${profileId} dose not exist!`);

        draft = profilesAdapter.updateOne(draft, {
          id: profileId,
          changes: { steps: steps.filter((v) => v.id !== stepId) },
        });
      }),
    }),
  }),
});

export const {
  useGetProfilesQuery,
  usePutProfileMutation,
  usePutProfileStepMutation,
  useDeleteProfileMutation,
  useDeleteProfileStepMutation,
  useCreateProfileMutation,
} = profileApi;

export const { selectAll: selectAllProfiles, selectById: selectProfileById } =
  profilesAdapter.getSelectors(
    (state?: EntityState<Profile>) => state ?? initialState
  );

function optimisticUpdateCache<QueryArg>(
  func: (
    draft: MaybeDrafted<EntityState<Profile>>,
    arg: QueryArg
  ) => typeof draft | void
) {
  return <
    BaseQuery extends BaseQueryFn,
    ResultType,
    ReducerPath extends string = string
  >(
    arg: QueryArg,
    {
      dispatch,
      queryFulfilled,
    }: MutationLifecycleApi<QueryArg, BaseQuery, ResultType, ReducerPath>
  ) => {
    try {
      const updatedProfile = dispatch(
        profileApi.util.updateQueryData("getProfiles", undefined, (draft) =>
          func(draft, arg)
        )
      );
      queryFulfilled.catch(updatedProfile.undo);
    } catch (e) {
      console.error(getErrorMessage(e));
      profileApi.util.invalidateTags(["profiles"]);
    }
  };
}
