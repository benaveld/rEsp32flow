import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { baseApiUrl } from "../config";
import { splitAppApi } from "../splitAppApi";

export const keepHistoryTime = 10 * 60 * 1000; // 10 min in ms

export interface TemperatureHistorySlice {
  uptime: number;
  oven: number;
  chip: number;
}

export interface HistoryGetResponse {
  historySampleRate: number;
  history: [TemperatureHistorySlice];
}

export interface StatusGetResponse extends TemperatureHistorySlice {
  fault: number;
  faultText: string[];
}

const statusJsonUrl = "status.json";
const temperatureJsonUrl = "temperature.json";
export const statusApiUrl = `${baseApiUrl}/${statusJsonUrl}`;
export const temperatureApiUrl = `${baseApiUrl}/${temperatureJsonUrl}`;

const historyAdapter = createEntityAdapter<TemperatureHistorySlice>({
  selectId: (slice) => slice.uptime,
  sortComparer: (a, b) => a.uptime - b.uptime,
});
const initialHistoryState = historyAdapter.getInitialState();

export const { selectAll: selectEntireHistory } = historyAdapter.getSelectors(
  (state?: EntityState<TemperatureHistorySlice>) => state ?? initialHistoryState
);

const statusApi = splitAppApi.injectEndpoints({
  endpoints: (build) => ({
    getStatusUpdate: build.query<StatusGetResponse, void>({
      query: () => statusJsonUrl,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const invalidateHistory = () =>
          dispatch(statusApi.util.invalidateTags(["history", "profiles"]));

        try {
          const { data: statusUpdate } = await queryFulfilled;
          dispatch(
            statusApi.util.updateQueryData(
              "getTemperatureHistory",
              undefined,
              (draft) => {
                const lastUptime = draft.ids.at(-1);
                if (lastUptime && lastUptime > statusUpdate.uptime) {
                  invalidateHistory();
                  return;
                }

                draft = historyAdapter.setOne(draft, statusUpdate);
                const idsToRemove = draft.ids.filter(
                  (uptime) => statusUpdate.uptime - keepHistoryTime > uptime
                );
                draft = historyAdapter.removeMany(draft, idsToRemove);
              }
            )
          );
        } catch {
          invalidateHistory();
        }
      },
    }),

    getTemperatureHistory: build.query<
      EntityState<TemperatureHistorySlice>,
      void
    >({
      query: () => `${temperatureJsonUrl}?timeBack=${keepHistoryTime}`,
      providesTags: ["history"],
      transformResponse(response: HistoryGetResponse) {
        return historyAdapter.addMany(initialHistoryState, response.history);
      },
    }),
  }),
});

export const { useGetStatusUpdateQuery, useGetTemperatureHistoryQuery } =
  statusApi;
