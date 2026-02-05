import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";
import type {
  AchievementGroup,
  CreateAchievementGroup,
  UpdateAchievementGroup,
  Achievement,
} from "@achievements-tracker/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  keepUnusedDataFor: 1,
  tagTypes: ["AchievementGroup"],
  endpoints: (builder) => ({
    getAchievementGroups: builder.query<AchievementGroup[], void>({
      query: () => ({
        url: "/api/achievements",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AchievementGroup" as const,
                id,
              })),
              { type: "AchievementGroup", id: "LIST" },
            ]
          : [{ type: "AchievementGroup", id: "LIST" }],
    }),
    getAchievementGroup: builder.query<AchievementGroup, string>({
      query: (id) => `/api/achievements/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AchievementGroup", id }],
    }),
    createAchievementGroup: builder.mutation<
      AchievementGroup,
      CreateAchievementGroup
    >({
      query: (body) => ({
        url: "/api/achievements",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AchievementGroup", id: "LIST" }],
    }),
    updateAchievementGroup: builder.mutation<
      AchievementGroup,
      { id: string; data: UpdateAchievementGroup }
    >({
      query: ({ id, data }) => ({
        url: `/api/achievements/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AchievementGroup", id },
      ],
    }),
    deleteAchievementGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/achievements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AchievementGroup", id },
        { type: "AchievementGroup", id: "LIST" },
      ],
    }),
    addAchievement: builder.mutation<
      AchievementGroup,
      { id: string; item: Achievement }
    >({
      query: ({ id, item }) => ({
        url: `/api/achievements/${id}/items`,
        method: "POST",
        body: item,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AchievementGroup", id },
        { type: "AchievementGroup", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAchievementGroupsQuery,
  useGetAchievementGroupQuery,
  useCreateAchievementGroupMutation,
  useUpdateAchievementGroupMutation,
  useDeleteAchievementGroupMutation,
  useAddAchievementMutation,
} = api;
