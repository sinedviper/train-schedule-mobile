import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '@/utils/types';
import { getMe, logout } from '@/store/auth/api';

export interface IAuthState {
  user: IUser | null;
}

const initialState: IAuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addMatcher(logout.matchFulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
