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
    }),
    getPlacesSearch: builder.mutation<
      IPagination<IPlace[]>,
      { search?: string }
    >({
      query: (params) => {
        return { url: '/places', params };
      },
    }),
    getPlacesPagination: builder.mutation<
      IPagination<IPlace[]>,
      { page: number }
    >({
      query: (params) => ({ url: '/places', params }),
    }),
    getPlace: builder.query<IPlace, number>({
      query: (id) => ({ url: `/places/${id}` }),
      providesTags: (result, error, id) => [{ type: 'place', id }],
    }),
    createPlace: builder.mutation<IPlace, CreatePlaceDto>({
      query: (data) => ({
        url: '/places',
        method: 'POST',
        body: data,
      }),
    }),
    updatePlace: builder.mutation<IPlace, { id: number; data: UpdatePlaceDto }>(
      {
        query: ({ id, data }) => ({
          url: `/places/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'place', id }],
      },
    ),
    deletePlace: builder.mutation<IPlace, number>({
      query: (id) => ({
        url: `/places/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'place', id }],
    }),
  }),
});

export const {
  useGetPlacesQuery,
  useCreatePlaceMutation,
  useUpdatePlaceMutation,
  useDeletePlaceMutation,
  useGetPlacesPaginationMutation,
  useGetPlaceQuery,
  useGetPlacesSearchMutation,
} = placesApi;

export const {
  endpoints: {
    getPlaces,
    getPlacesPagination,
    createPlace,
    updatePlace,
    deletePlace,
  },
} = placesApi;
