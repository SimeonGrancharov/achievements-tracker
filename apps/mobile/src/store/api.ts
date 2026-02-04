import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index';
import type {
  Achievement,
  CreateAchievement,
  UpdateAchievement,
  AchievementItem,
} from '@achievements-tracker/shared';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Achievement'],
  endpoints: (builder) => ({
    getAchievements: builder.query<Achievement[], void>({
      query: () => '/api/achievements',
      providesTags: ['Achievement'],
    }),
    getAchievement: builder.query<Achievement, string>({
      query: (id) => `/api/achievements/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Achievement', id }],
    }),
    createAchievement: builder.mutation<Achievement, CreateAchievement>({
      query: (body) => ({
        url: '/api/achievements',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Achievement'],
    }),
    updateAchievement: builder.mutation<
      Achievement,
      { id: string; data: UpdateAchievement }
    >({
      query: ({ id, data }) => ({
        url: `/api/achievements/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Achievement', id }],
    }),
    deleteAchievement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/achievements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Achievement'],
    }),
    addAchievementItem: builder.mutation<
      Achievement,
      { id: string; item: AchievementItem }
    >({
      query: ({ id, item }) => ({
        url: `/api/achievements/${id}/items`,
        method: 'POST',
        body: item,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Achievement', id }],
    }),
  }),
});

export const {
  useGetAchievementsQuery,
  useGetAchievementQuery,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
  useAddAchievementItemMutation,
} = api;
