import { api } from '@/store/services/api';
import {
  CreateFavoriteDto,
  IFavoriteSchedule,
  IPagination,
} from '@/utils/types';
import { setFavSchedule } from '@/store/schedules';

export const favoritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<IPagination<IFavoriteSchedule[]>, void>({
      query: () => ({ url: '/favorites', method: 'GET' }),
      providesTags: ['favorite'],
    }),
    getFavoritesPagination: builder.mutation<
      IPagination<IFavoriteSchedule[]>,
      { page: number }
    >({
      query: (params) => ({ url: '/favorites', method: 'GET', params }),
    }),
    addFavorite: builder.mutation<IFavoriteSchedule, CreateFavoriteDto>({
      query: (data) => ({
        url: '/favorites',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(schedule, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(setFavSchedule(schedule.scheduleId));
        } catch (error) {
          console.error('Failed to clear token:', error);
        }
      },
    }),
    removeFavorite: builder.mutation<IFavoriteSchedule, number>({
      query: (scheduleId) => ({
        url: `/favorites/${scheduleId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(scheduleId, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(setFavSchedule(scheduleId));
        } catch (error) {
          console.error('Failed to clear token:', error);
        }
      },
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesPaginationMutation,
} = favoritesApi;

export const {
  endpoints: {
    getFavorites,
    getFavoritesPagination,
    addFavorite,
    removeFavorite,
  },
} = favoritesApi;
