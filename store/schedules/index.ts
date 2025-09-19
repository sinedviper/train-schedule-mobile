import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISchedule } from '@/utils/types';
import { getSchedules } from '@/store/schedules/api';

export interface ISchedulesState {
  schedules: ISchedule[];
}

const initialState: ISchedulesState = {
  schedules: [],
};

export const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setUpdateSchedule: (state, { payload }: PayloadAction<ISchedule>) => {
      const findItem = state.schedules.find((v) => v.id === payload.id);
      if (findItem) {
        state.schedules = state.schedules.map((v) =>
          v.id === payload.id ? payload : v,
        );
      }
    },
    setAddSchedule: (state, { payload }: PayloadAction<ISchedule>) => {
      state.schedules = [...state.schedules, payload];
    },
    setFilterSchedules: (state, { payload }: PayloadAction<number>) => {
      state.schedules = state.schedules.filter((item) => item.id !== payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(getSchedules.matchFulfilled, (state, { payload }) => {
      state.schedules = payload;
    });
  },
});

export const { setFilterSchedules, setAddSchedule, setUpdateSchedule } =
  schedulesSlice.actions;

export default schedulesSlice.reducer;
