import { createLogger } from "redux-logger";
import { configureStore, isRejected } from "@reduxjs/toolkit";
import { profileSlice } from "./profile/state/profileSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { splitAppApi } from "./splitAppApi";

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
    [profileSlice.name]: profileSlice.reducer,
    [splitAppApi.reducerPath]: splitAppApi.reducer,
  },

  preloadedState: {
    [profileSlice.name]: profileSlice.getInitialState(),
  },

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(splitAppApi.middleware);

    if (process.env.NODE_ENV === "development")
      return middleware.concat(logger);

    return middleware;
  },
});

setupListeners(store.dispatch);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
