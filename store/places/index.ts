import { createSlice } from '@reduxjs/toolkit';
import { IPlace } from '@/utils/types';
import {
  createPlace,
  deletePlace,
  getPlaces,
  getPlacesPagination,
  updatePlace,
} from '@/store/places/api';

export interface IPlacesState {
  places: IPlace[];
  total: number;
  limit: number;
  page: number;
}

const initialState: IPlacesState = {
  places: [],
  total: 1,
  limit: 20,
  page: 1,
};

export const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(getPlaces.matchFulfilled, (state, { payload }) => {
        state.places = payload.data;
        state.total = payload.meta.total;
        state.limit = payload.meta.limit;
        state.page = payload.meta.page;
      })
      .addMatcher(getPlacesPagination.matchFulfilled, (state, { payload }) => {
        state.places = [...state.places, ...payload.data];
        state.total = payload.meta.total;
        state.limit = payload.meta.limit;
        state.page = payload.meta.page;
      })
      .addMatcher(createPlace.matchFulfilled, (state, { payload }) => {
        state.places = [...state.places, payload];
      })
      .addMatcher(updatePlace.matchFulfilled, (state, { payload }) => {
        state.places = state.places.map((place) => {
          if (place.id === payload.id) {
            place.name = payload.name;
          }
          return place;
        });
      })
      .addMatcher(deletePlace.matchFulfilled, (state, { payload }) => {
        state.places = state.places.filter((place) => place.id !== payload.id);
      });
  },
});

export default placesSlice.reducer;
