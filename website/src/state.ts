import { createLogger } from "redux-logger";
import { configureStore, isRejected } from "@reduxjs/toolkit";
import profileSlice from "./profile/state/profileSlice";
import { statusApi } from "./status/statusApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const logger = createLogger({
  // Change this to log a redux action, true -> log
  predicate: (_, action, logEntry) => {
    if (isRejected(action)) return true;

    // // Example of logging a specific action
    // if (typeof action.type === "string") {
    //   const type = action.type as string;
    //   if (type.startsWith(profileSlice.name)) return true;
    // }

    return Boolean(logEntry?.error);
  },
});

export const store = configureStore({
  reducer: {
    profileState: profileSlice.reducer,
    [statusApi.reducerPath]: statusApi.reducer,
  },

  preloadedState: {
    profileState: profileSlice.getInitialState(),
  },

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(statusApi.middleware);

    if (process.env.NODE_ENV !== "production")
      return middleware.concat(logger);

    return middleware;
  },
});

setupListeners(store.dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
