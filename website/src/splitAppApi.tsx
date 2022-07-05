import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApiUrl, requestMode } from "./config";

export const splitAppApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    mode: requestMode,
  }),
  tagTypes: ["history", "profiles"],
  endpoints: () => ({}),
});
