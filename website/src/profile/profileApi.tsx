import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { MaybeDrafted } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { MutationLifecycleApi } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query/react";
import { baseApiUrl, requestMode } from "../config";
import { Profile, ProfileStep } from "./profileTypes";

const profileUrl = "profiles.json";
export const profileApiUrl = `${baseApiUrl}/${profileUrl}`;

const profilesAdapter = createEntityAdapter<Profile>({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});
const initialState = profilesAdapter.getInitialState();

export const ProfileApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    mode: requestMode,
    headers: { "Content-Type": "application/json" },
  }),
  reducerPath: "profileApi",
  endpoints: (build) => ({
    getProfiles: build.query<typeof initialState, void>({
      query: () => profileUrl,
      transformResponse(response: Profile[]) {
        return profilesAdapter.setAll(
          initialState,
          response.map((v) => ("steps" in v ? v : { ...v, steps: [] }))
        );
      },
    }),

    putProfile: build.mutation<void, Profile>({
      query: (profile) => ({
        url: `${profileUrl}?id=${profile.id}`,
        method: "PUT",
        body: profile,
      }),
      onQueryStarted: optimisticUpdateCache<Profile>(profilesAdapter.setOne),
    }),

    putProfileStep: build.mutation<void, { step: ProfileStep }>({
      query: ({ step }) => ({
        url: `${profileUrl}?id=${step.profileId}&stepId=${step.id}`,
        method: "PUT",
        body: step,
      }),
      onQueryStarted: optimisticUpdateCache((draft, { step }) => {
        const { profileId, id } = step;
        const steps = selectProfileById(draft, profileId)?.steps;
        if (!steps)
          throw new Error(`profile with the id ${profileId} dose not exist!`);

        const editedSteps = steps.find((v) => v.id === id)
          ? steps.map((v) => (v.id === id ? step : v)) // Update step
          : steps.concat(step).sort((a, b) => a.id - b.id); // Add step

        draft = profilesAdapter.updateOne(draft, {
          id: profileId,
          changes: { steps: editedSteps },
        });
      }),
    }),

    deleteProfile: build.mutation<void, Profile["id"]>({
      query: (id) => ({
        url: `${profileUrl}?id=${id}`,
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
        url: `${profileUrl}?id=${profileId}&stepId=${stepId}`,
        method: "DELETE",
      }),
      onQueryStarted: optimisticUpdateCache((draft, { profileId, stepId }) => {
        const steps = selectProfileById(draft, profileId)?.steps;
        if (!steps)
          throw new Error(`profile with the id ${profileId} dose not exist!`);

        if (steps.length <= stepId || stepId < 0)
          throw new Error(
            `Step index ${stepId} is out of bounds for profile ${profileId}.`
          );

        const updatedSteps = steps.filter((v) => v.id !== stepId);
        draft = profilesAdapter.updateOne(draft, {
          id: profileId,
          changes: { steps: updatedSteps },
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
} = ProfileApi;

export const { selectAll: selectAllProfiles, selectById: selectProfileById } =
  profilesAdapter.getSelectors<EntityState<Profile> | undefined>(
    (state) => state ?? initialState
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
    const updatedProfile = dispatch(
      ProfileApi.util.updateQueryData("getProfiles", undefined, (draft) =>
        func(draft, arg)
      )
    );
    queryFulfilled.catch(updatedProfile.undo);
  };
}
