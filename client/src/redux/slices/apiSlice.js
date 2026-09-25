import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const API_URI = import.meta.env.VITE_SERVER_API;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const user = getState().auth?.user;
    if (user?.token) {
      headers.set("authorization", `Bearer ${user.token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Task", "User", "Notifications"],
  endpoints: (builder) => ({}),
});
