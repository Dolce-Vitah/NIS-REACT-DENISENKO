import { baseApi } from '@/shared/api/baseApi';
import { type AuthUser } from '../model/authSlice';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse extends AuthUser {
  token?: string;
  accessToken?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = authApi;