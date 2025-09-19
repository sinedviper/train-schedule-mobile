import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFavoriteSchedule, ISchedule } from '@/utils/types';
import { getFavorites } from '@/store/favorites/api';

export interface IFavoritesState {
  favorites: IFavoriteSchedule[];
}

const initialState: IFavoritesState = {
  favorites: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setUpdateFavorite: (state, { payload }: PayloadAction<ISchedule>) => {
      const findItem = state.favorites.find(
        (v) => v.schedule.id === payload.id,
      );
      if (findItem) {
        state.favorites = state.favorites.map((v) =>
          v.schedule.id === payload.id ? { ...v, schedule: payload } : v,
        );
      }
    },
    setFilterFavorites: (state, { payload }: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(
        (item) => item.schedule.id !== payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(getFavorites.matchFulfilled, (state, { payload }) => {
      state.favorites = payload;
    });
  },
});

export const { setFilterFavorites, setUpdateFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
