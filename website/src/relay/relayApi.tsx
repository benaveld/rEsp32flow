import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { baseApiUrl, baseUrl, requestMode } from "../config";
import { Profile } from "../profile/profileTypes";

const relayUrl = "relay";
export const relayApiUrl = `${baseApiUrl}/${relayUrl}`;
export const relayApiWebSocketUrl = `ws://${baseUrl}/ws/relay`;

export interface RelayApiGet {
  info?: {
    profileId: number;
    stepId: number;
    stepTime: number;
    relayOnTime: number;
    updateRate: number;
  };
}

export const RelayApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${baseApiUrl}`,
    mode: requestMode,
    headers: { "Content-Type": "application/json" },
  }),
  reducerPath: "relay",
  endpoints: (build) => ({
    getRelayStatus: build.query<RelayApiGet, void>({
      query: () => relayUrl,
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket(relayApiWebSocketUrl);
        try {
          await cacheDataLoaded;

          ws.addEventListener("message", (ev: MessageEvent<RelayApiGet>) =>
            updateCachedData((draft) => draft = ev.data)
          );
        } finally {
          await cacheEntryRemoved;
          ws.close();
        }
      },
    }),

    eStopRelay: build.mutation<void, void>({
      query: () => ({ url: `${relayUrl}?eStop`, method: "POST" }),
    }),

    startRelay: build.mutation<void, Profile["id"]>({
      query: (id) => ({
        url: `${relayUrl}?startId=${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetRelayStatusQuery,
  useEStopRelayMutation,
  useStartRelayMutation,
} = RelayApi;
