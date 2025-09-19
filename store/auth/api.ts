import { api } from '@/store/services/api';
import {
  IAuthRegistration,
  IAuthResponse,
  IUser,
  UpdatePasswordProfileDto,
  UpdateProfileDto,
} from '@/utils/types';
import { setAccess, setRefresh } from '@/store/token';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    registration: build.mutation<IAuthResponse, IAuthRegistration>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(setAccess(data.access_token));
            dispatch(setRefresh(data.refresh_token));
            dispatch(getMe.initiate());
          }
        } catch (error) {
          console.error('Failed to set token:', error);
        }
      },
      invalidatesTags: ['user'],
    }),
    login: build.mutation<
      IAuthResponse,
      Pick<IAuthRegistration, 'login' | 'password'>
    >({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          if (data) {
            dispatch(setAccess(data.access_token));
            dispatch(setRefresh(data.refresh_token));

            dispatch(getMe.initiate());
          }
        } catch (error) {
          console.error('Failed to set token:', error);
        }
      },
      invalidatesTags: ['user'],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(setAccess(null));
          dispatch(setRefresh(null));
        } catch (error) {
          console.error('Failed to clear token:', error);
        }
      },
    }),
    getMe: build.query<IUser, void>({
      query: () => {
        return {
          url: '/users/me',
        };
      },
      providesTags: ['user'],
    }),
    updateProfile: build.mutation<IUser, UpdateProfileDto>({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
    updatePassword: build.mutation<IUser, UpdatePasswordProfileDto>({
      query: (data) => ({
        url: '/users/password',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useUpdatePasswordMutation,
} = authApi;

export const {
  endpoints: { registration, login, getMe, updateProfile, logout },
} = authApi;
