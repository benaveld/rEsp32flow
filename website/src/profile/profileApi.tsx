import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { MaybeDrafted } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import { MutationLifecycleApi } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query/react";
import { baseApiUrl, requestMode } from "../config";
import { Profile } from "./profile";
import { ProfileStep } from "./profileStep";

const profileUrl = "profiles.json";
export const profileApiUrl = `${baseApiUrl}/${profileUrl}`;

const profilesAdapter = createEntityAdapter<Profile>({
  selectId: (profile) => profile.id,
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
    getProfiles: build.query<EntityState<Profile>, void>({
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

    putProfileStep: build.mutation<
      void,
      { id: Profile["id"]; step: ProfileStep; stepIndex: number }
    >({
      query: ({ id, stepIndex, step }) => ({
        url: `${profileUrl}?id=${id}&stepId=${stepIndex}`,
        method: "PUT",
        body: step,
      }),
      onQueryStarted: optimisticUpdateCache(
        (draft, { id, step, stepIndex }) => {
          let steps = selectProfileById(draft, id)?.steps;
          if (!steps)
            throw new Error(`profile with the id ${id} dose not exist!`);

          if (steps.length < stepIndex || stepIndex < 0)
            throw new Error(
              `Step index ${stepIndex} is out of bounds for profile ${id}.`
            );

          if (steps.length === stepIndex) steps = steps.concat(step);
          else steps[stepIndex] = step;

          draft = profilesAdapter.updateOne(draft, { id, changes: { steps } });
        }
      ),
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
      { id: Profile["id"]; stepIndex: number }
    >({
      query: ({ id, stepIndex }) => ({
        url: `${profileUrl}?id=${id}&stepId=${stepIndex}`,
        method: "DELETE",
      }),
      onQueryStarted: optimisticUpdateCache((draft, { id, stepIndex }) => {
        const steps = selectProfileById(draft, id)?.steps;
        if (!steps)
          throw new Error(`profile with the id ${id} dose not exist!`);

        if (steps.length <= stepIndex || stepIndex < 0)
          throw new Error(
            `Step index ${stepIndex} is out of bounds for profile ${id}.`
          );

        const updatedSteps = steps.filter((_, i) => i !== stepIndex);
        draft = profilesAdapter.updateOne(draft, {
          id,
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
