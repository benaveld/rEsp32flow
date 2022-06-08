import { createLogger } from "redux-logger";
import { configureStore, isRejected } from "@reduxjs/toolkit";
import statusSlice from "./status/state/statusSlice";
import profileSlice from "./profile/state/profileSlice";

const logger = createLogger({
  // Change this to log a redux action, true -> log
  predicate: (getState, action, logEntry) => {
    if (isRejected(action)) return true;

    // Example of logging a specific action
    // if (typeof action.type === "string") {
    //   const type = action.type as string;
    //   if (type.startsWith(saveProfile.typePrefix)) return true;
    // }

    return Boolean(logEntry?.error);
  },
});

export const store = configureStore({
  reducer: {
    profileState: profileSlice.reducer,
    statusState: statusSlice.reducer,
  },
  preloadedState: {
    profileState: profileSlice.getInitialState(),
    statusState: statusSlice.getInitialState(),
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
