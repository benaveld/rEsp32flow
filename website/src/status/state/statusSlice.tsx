import { createSlice } from "@reduxjs/toolkit";
import { StatusState } from "./statusTypes";
import { updateStatus } from "./statusActions";

const keepHistoryTime = 10 * 60 * 1000; // 10 min in ms

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
    .filter((value) => update.uptime - discardOlder <= value.uptime)
    .sort((a, b) => a.uptime - b.uptime);

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

    // Loading
    builder.addCase(updateStatus.pending, (state, action) => {
      state.loading = true;
    });

    // Handle error
    builder.addCase(updateStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

// export const {} = statusSlice.actions;
export default statusSlice;
