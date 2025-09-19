import { api } from '@/store/services/api';
import {
  CreateScheduleDto,
  IPagination,
  ISchedule,
  IScheduleFilter,
  UpdateScheduleDto,
} from '@/utils/types';

export const schedulesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<IPagination<ISchedule[]>, IScheduleFilter>({
      query: (params) => {
        return {
          url: `/schedules`,
          params,
        };
      },
      providesTags: ['schedule'],
    }),
    getSchedulesPagination: builder.mutation<
      IPagination<ISchedule[]>,
      IScheduleFilter
    >({
      query: (params) => {
        return {
          url: `/schedules`,
          params,
        };
      },
    }),
    getSchedule: builder.query<ISchedule, number>({
      query: (id) => ({ url: `/schedules/${id}` }),
      providesTags: (result, error, id) => [{ type: 'schedule', id }],
    }),
    createSchedule: builder.mutation<ISchedule, CreateScheduleDto>({
      query: (data) => ({
        url: '/schedules',
        method: 'POST',
        body: data,
      }),
    }),
    updateSchedule: builder.mutation<
      ISchedule,
      { id: number; data: UpdateScheduleDto }
    >({
      query: ({ id, data }) => ({
        url: `/schedules/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'schedule', id }],
    }),
    deleteSchedule: builder.mutation<void, number>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'schedule', id }],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesPaginationMutation,
} = schedulesApi;

export const {
  endpoints: { getSchedules, getSchedulesPagination },
} = schedulesApi;
