import { api } from '@/store/services/api';
import { CreateFavoriteDto, IFavoriteSchedule } from '@/utils/types';

export const favoritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<IFavoriteSchedule[], void>({
      query: () => ({ url: '/favorites', method: 'GET' }),
      providesTags: ['favorite'],
    }),
    addFavorite: builder.mutation<IFavoriteSchedule, CreateFavoriteDto>({
      query: (data) => ({
        url: '/favorites',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['favorite'],
    }),
    removeFavorite: builder.mutation<void, number>({
      query: (scheduleId) => ({
        url: `/favorites/${scheduleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['favorite'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;

export const {
  endpoints: { getFavorites },
} = favoritesApi;
