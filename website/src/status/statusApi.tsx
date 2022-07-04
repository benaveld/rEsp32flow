import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { baseApiUrl, requestMode } from "../config";

export const keepHistoryTime = 10 * 60 * 1000; // 10 min in ms

export type TemperatureHistorySlice = {
  uptime: number;
  oven: number;
  chip: number;
};

export interface HistoryGetResponse {
  historySampleRate: number;
  history: [TemperatureHistorySlice];
}

export type StatusGetResponse = {
  fault: number;
  faultText: string[];
} & TemperatureHistorySlice;

const statusJsonUrl = "status.json";
const temperatureJsonUrl = "temperature.json";
export const statusApiUrl = `http://${baseApiUrl}/${statusJsonUrl}`;
export const temperatureApiUrl = `http://${baseApiUrl}/${temperatureJsonUrl}`;

const historyAdapter = createEntityAdapter<TemperatureHistorySlice>({
  selectId: (slice) => slice.uptime,
  sortComparer: (a, b) => a.uptime - b.uptime,
});

export const historySelector = historyAdapter.getSelectors();

export const statusApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${baseApiUrl}`,
    mode: requestMode,
  }),
  reducerPath: "status",
  tagTypes: ["history"],
  endpoints: (build) => ({
    getStatusUpdate: build.query<StatusGetResponse, void>({
      query: () => statusJsonUrl,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: statusUpdate } = await queryFulfilled;
          dispatch(
            statusApi.util.updateQueryData(
              "getTemperatureHistory",
              undefined,
              (draft) => {
                const lastUptime = draft.ids.at(-1);
                if (lastUptime && lastUptime > statusUpdate.uptime)
                  dispatch(statusApi.util.invalidateTags(["history"]));

                draft = historyAdapter.setOne(draft, statusUpdate);
                const idsToRemove = draft.ids.filter(
                  (uptime) => statusUpdate.uptime - keepHistoryTime > uptime
                );
                draft = historyAdapter.removeMany(draft, idsToRemove);
              }
            )
          );
        } catch {}
      },
    }),

    getTemperatureHistory: build.query<
      EntityState<TemperatureHistorySlice>,
      void
    >({
      query: () => `${temperatureJsonUrl}?timeBack=${keepHistoryTime}`,
      providesTags: ["history"],
      transformResponse(response: HistoryGetResponse) {
        return historyAdapter.addMany(
          historyAdapter.getInitialState(),
          response.history
        );
      },
    }),
  }),
});

export const { useGetStatusUpdateQuery, useGetTemperatureHistoryQuery } =
  statusApi;
