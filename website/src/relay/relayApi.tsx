import { splitAppApi, baseApiUrl, baseUrl } from "../splitAppApi";
import { Profile } from "../profile/profileTypes";

const relayUrl = "relay";
export const relayApiUrl = `${baseApiUrl}/${relayUrl}`;
export const relayApiWebSocketUrl = `ws://${baseUrl}/ws/relay`;

export interface RelayApiGet {
  updateRate: number;
  uptime: number;
  info?: {
    profileId: number;
    stepId: number;
    stepTime: number;
    relayOnTime: number;
  };
}

const relayApi = splitAppApi.injectEndpoints({
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

          ws.addEventListener("message", (ev) =>
            updateCachedData((_draft) => (_draft = JSON.parse(ev.data)))
          );

          ws.addEventListener("close", () =>
            updateCachedData((draft) => (draft = { ...draft, info: undefined }))
          );
        } finally {
          await cacheEntryRemoved;
          ws.close();
        }
      },
    }),

    eStopRelay: build.mutation<void, void>({
      query: () => ({
        url: relayUrl,
        method: "POST",
        params: { eStop: true },
      }),
    }),

    startRelay: build.mutation<void, Profile["id"]>({
      query: (id) => ({
        url: relayUrl,
        method: "POST",
        params: {
          startId: id,
        },
      }),
    }),

    setSampleRate: build.mutation<void, RelayApiGet["updateRate"]>({
      query: (value) => ({
        url: relayUrl,
        method: "POST",
        params: {
          sampleRate: value,
        },
      }),
    }),
  }),
});

export const {
  useGetRelayStatusQuery,
  useEStopRelayMutation,
  useStartRelayMutation,
  useSetSampleRateMutation,
} = relayApi;
