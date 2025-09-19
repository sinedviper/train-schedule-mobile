import { api } from '@/store/services/api';
import {
  CreatePlaceDto,
  IPagination,
  IPlace,
  UpdatePlaceDto,
} from '@/utils/types';

export const placesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlaces: builder.query<IPagination<IPlace[]>, void>({
      query: () => ({ url: '/places' }),
      providesTags: ['place'],
    }),
    createPlace: builder.mutation<IPlace, CreatePlaceDto>({
      query: (data) => ({
        url: '/places',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['place'],
    }),
    updatePlace: builder.mutation<IPlace, { id: number; data: UpdatePlaceDto }>(
      {
        query: ({ id, data }) => ({
          url: `/places/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['place'],
      },
    ),
    deletePlace: builder.mutation<void, number>({
      query: (id) => ({
        url: `/places/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['place'],
    }),
  }),
});

export const {
  useGetPlacesQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
} = placesApi;
