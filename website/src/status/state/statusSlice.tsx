import { createSlice, isPending, isRejectedWithValue } from "@reduxjs/toolkit";
import { StatusState } from "./statusTypes";
import { loadTemperatureHistory, updateStatus } from "./statusActions";

export const keepHistoryTime = 10 * 60 * 1000; // 10 min in ms

const initialState = {
  loading: false,
  error: undefined,
  isOn: false,
  profileId: 0,
  profileStepIndex: 0,
  stepTime: 0,
  oven: 0,
  chip: 0,
  uptime: 0,
  history: [],
  fault: 0,
  faultText: [],
  relayOnTime: 0,
  updateRate: 0,
} as StatusState;

const insertAndCleanHistory = (
  history: StatusState["history"],
  update: typeof history[number],
  discardOlder: number
) =>
  history
    .concat(update)
    .filter((value) => update.uptime - discardOlder <= value.uptime);

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Update status
    builder.addCase(updateStatus.fulfilled, (state, action) => {
      if (action.payload.uptime < state.uptime) {
        return {
          ...initialState,
          ...action.payload,
          loading: false,
          error: "Oven restarted.",
          history: insertAndCleanHistory([], action.payload, keepHistoryTime),
        };
      }

      return {
        ...state,
        loading: false,
        error: undefined,
        ...action.payload,
        history: insertAndCleanHistory(
          state.history,
          action.payload,
          keepHistoryTime
        ),
      };
    });

    builder.addCase(loadTemperatureHistory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload === null) return;

      state.error = undefined;
      state.history = state.history
        .concat(action.payload.history)
        .sort((a, b) => a.uptime - b.uptime);
    });

    // Loading
    builder.addMatcher(isPending, (state) => {
      state.loading = true;
    });

    // Handle error
    builder.addMatcher(isRejectedWithValue, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// export const {} = statusSlice.actions;
export default statusSlice;
