import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/api/axiosBaseQuery";

export type LoginRequest = {
  email: string;
  password: string;
  csrfToken?: string | null;
};

export type LoginResponse = {
  user?: {
    id: string;
    name?: string | null;
    role?: string | null;
  };
};

export type CsrfResponse = {
  csrfToken: string;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    csrf: builder.query<CsrfResponse, void>({
      query: () => ({
        url: "/auth/csrf",
        method: "GET",
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const { useCsrfQuery, useLoginMutation } = api;
