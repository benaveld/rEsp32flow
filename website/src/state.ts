import { createLogger } from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import statusSlice from "./status/state/statusSlice";
import profileSlice from "./profile/state/profileSlice";

const logger = createLogger({
  // Change this to log a redux action, true -> log 
  predicate: (getState, action, logEntry) => action.type === undefined,
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
export type AppDispatch = typeof store.dispatch
