import { api } from '@/store/services/api';
import {
  IAuthRegistration,
  IAuthResponse,
  IUser,
  UpdateProfileDto,
} from '@/utils/types';
import tokenService from '@/services/TokenService';

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
            await tokenService.setToken(data.access_token, 'accessToken');
            await tokenService.setToken(data.refresh_token, 'refreshToken');

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
            await tokenService.setToken(data.access_token, 'accessToken');
            await tokenService.setToken(data.refresh_token, 'refreshToken');

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
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          await tokenService.removeTokens();
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
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;

export const {
  endpoints: { registration, login, getMe, updateProfile, logout },
} = authApi;
