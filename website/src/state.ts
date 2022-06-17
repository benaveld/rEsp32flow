import { createLogger } from "redux-logger";
import { configureStore, isRejected } from "@reduxjs/toolkit";
import statusSlice from "./status/state/statusSlice";
import profileSlice from "./profile/state/profileSlice";
import { CurriedGetDefaultMiddleware } from "@reduxjs/toolkit/dist/getDefaultMiddleware";

export const reducer = {
  profileState: profileSlice.reducer,
  statusState: statusSlice.reducer,
};

export const preloadedState = {
  profileState: profileSlice.getInitialState(),
  statusState: statusSlice.getInitialState(),
};

function getMiddleware(
  getDefaultMiddleware: CurriedGetDefaultMiddleware<typeof preloadedState>
) {
  let middleware = getDefaultMiddleware();
  if (process.env.NODE_ENV === "development") {
    middleware.push(
      createLogger({
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
      })
    );
  }
  return middleware;
}

export const store = configureStore({
  reducer,
  preloadedState,
  middleware: getMiddleware,
  devTools: process.env.NODE_ENV !== "production",
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
