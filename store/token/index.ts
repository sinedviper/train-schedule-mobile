import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITokenState {
  access: string | null;
  refresh: string | null;
}

const initialState: ITokenState = {
  access: null,
  refresh: null,
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setAccess: (state, { payload }: PayloadAction<string | null>) => {
      state.access = payload;
    },
    setRefresh: (state, { payload }: PayloadAction<string | null>) => {
      state.refresh = payload;
    },
  },
});

export default tokenSlice.reducer;
export const { setAccess, setRefresh } = tokenSlice.actions;
