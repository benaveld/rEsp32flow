import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseUrl = "resp32flow.local";
export const baseUrl = "192.168.1.69";
export const baseApiUrl = `http://${baseUrl}/api`;

export const requestMode: RequestMode = "cors";
// process.env.NODE_ENV === "development" ? "cors" : "no-cors";

export const splitAppApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    mode: requestMode,
  }),
  refetchOnReconnect: true,
  tagTypes: ["history", "profiles"],
  endpoints: () => ({}),
});
