// src/lib/services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    data: {
      id: number;
      name: string;
      email: string;
      role: string;
      date_created: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
      // etc.
    };
  };
}




export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://cbtgrinder.com/api/admin" }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, FormData>({
      query: (formData) => ({
        url: "/auth/login.php",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

// Export hooks
export const { useLoginUserMutation } = api;
