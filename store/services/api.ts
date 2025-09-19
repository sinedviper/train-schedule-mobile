import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  retry,
} from '@reduxjs/toolkit/query/react';
import { getApiUrl } from '@/utils/helpers';
import { IApiError } from '@/utils/types';
import {
  BaseQueryFn,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import tokenService from '@/services/TokenService';
import { router } from 'expo-router';

const baseUrl = getApiUrl();

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    const accessToken = await tokenService.getToken('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
  credentials: 'include',
});

type BaseQueryResult<T> =
  | { data: T; error?: undefined }
  | { error: IApiError; data?: undefined };

const baseQueryWithAuth: BaseQueryFn<FetchArgs, unknown, IApiError> = async (
  args,
  api,
  extraOptions,
): Promise<BaseQueryResult<any>> => {
  let result = (await rawBaseQuery(args, api, extraOptions)) as {
    data?: unknown;
    error?: FetchBaseQueryError;
    meta?: FetchBaseQueryMeta;
  };

  if (result.error) {
    const detailsError = result.error.data as {
      message?: string;
      path?: string;
      statusCode?: number;
      timestamp?: string;
    };
    const error: IApiError = {
      status:
        typeof result.error.status === 'number'
          ? result.error.status
          : detailsError.statusCode || 500,
      message:
        detailsError?.message ??
        // @ts-ignore
        (result.error?.error as string) ??
        'Unknown error',
      path: detailsError?.path || 'Unknown',
    };

    if (error.status === 401) {
      try {
        const refreshToken = await tokenService.getToken('refreshToken');

        if (refreshToken) {
          const refreshResponse = await rawBaseQuery(
            {
              url: '/auth/refresh',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions,
          );

          if (refreshResponse.data) {
            const { access_token } = refreshResponse.data as {
              access_token: string;
            };
            await tokenService.setToken(access_token, 'accessToken');

            if (args.headers) {
              if (args.headers instanceof Headers) {
                args.headers.set('Authorization', `Bearer ${access_token}`);
              } else if (Array.isArray(args.headers)) {
                args.headers.push(['Authorization', `Bearer ${access_token}`]);
              } else {
                args.headers = {
                  ...args.headers,
                  Authorization: `Bearer ${access_token}`,
                };
              }
            } else {
              args = {
                ...args,
                headers: { Authorization: `Bearer ${access_token}` },
              };
            }

            const retryResult = await rawBaseQuery(args, api, extraOptions);

            return { data: retryResult.data };
          } else {
            router.dismissAll();
            await tokenService.removeTokens();
          }
        } else {
          router.dismissAll();
          await tokenService.removeTokens();
        }
      } catch (e) {
        router.dismissAll();
        await tokenService.removeTokens();
      }
    }

    return { error };
  }

  return { data: result.data };
};

export const api = createApi({
  reducerPath: 'splitApi',
  baseQuery: retry(baseQueryWithAuth, { maxRetries: 0 }),
  tagTypes: ['main', 'schedule', 'favorite', 'place', 'user', 'auth'],
  refetchOnReconnect: false,
  endpoints: () => ({}),
});
