import { api } from '@/store/services/api';
import {
  CreateScheduleDto,
  ISchedule,
  IScheduleFilter,
  UpdateScheduleDto,
} from '@/utils/types';

export const schedulesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<ISchedule[], IScheduleFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        if (filter.trainType) {
          params.append('trainType', filter.trainType);
        }
        if (filter.start?.date) {
          params.append('start[date]', filter.start.date);
        }
        if (filter.start?.placeId) {
          params.append('start[placeId]', filter.start.placeId.toString());
        }
        if (filter.end?.date) {
          params.append('end[date]', filter.end.date);
        }
        if (filter.end?.placeId) {
          params.append('end[placeId]', filter.end.placeId.toString());
        }

        return {
          url: `/schedules?${params.toString()}`,
        };
      },
      providesTags: ['schedule'],
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
      invalidatesTags: (result, error, { id }) => [
        { type: 'schedule', id },
        'schedule',
      ],
    }),
    deleteSchedule: builder.mutation<void, number>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['schedule'],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = schedulesApi;

export const {
  endpoints: { getSchedules },
} = schedulesApi;
