import { createSlice } from "@reduxjs/toolkit";
import { StatusState } from "./statusTypes";
import { updateStatus } from "./statusActions";

const keepHistoryTime = 10 * 60 * 1000; // 10 min in ms

export const initialStatusState: StatusState = {
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
};

const insertAndCleanHistory = (
  history: StatusState["history"],
  update: typeof history[number],
  discardOlder: number
) =>
  history.concat([update])
    .filter((value) => update.uptime - discardOlder <= value.uptime)
    .sort((a, b) => a.uptime - b.uptime);

const statusSlice = createSlice({
  name: "status",
  initialState: initialStatusState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateStatus.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(updateStatus.fulfilled, (state, action) => {
      if (action.payload.uptime === 0 || action.payload.oven === null)
        return { ...state, loading: false, error: "Invalid response" };

      return {
        ...state,
        loading: false,
        error: undefined,
        ...action.payload,
        history: insertAndCleanHistory(state.history, action.payload, keepHistoryTime),
      };
    });

    builder.addCase(updateStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

// export const {} = statusSlice.actions;
export default statusSlice;
