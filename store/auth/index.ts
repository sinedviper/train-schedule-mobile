import { createSlice } from '@reduxjs/toolkit';
import { IUser } from '@/utils/types';
import { getMe, login, logout, registration } from '@/store/auth/api';

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(registration.matchFulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addMatcher(login.matchFulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addMatcher(getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addMatcher(logout.matchFulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
