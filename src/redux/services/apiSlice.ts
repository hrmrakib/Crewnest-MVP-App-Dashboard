import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../features/auth/authSlice";

interface RootStateWithAuth {
  auth?: {
    token?: string | null;
    refreshToken?: string | null;
  };
}

// Public endpoints that must never receive an Authorization header
const PUBLIC_AUTH_ENDPOINTS = [
  "login",
  "register",
  "forgotPassword",
  "verifyForgotPasswordOTP",
  "resetPassword",
];

// Compute base URL ensuring /api/ prefix directly from .env configuration
const getBaseUrl = (): string => {
  const envUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_API_URL ||
    "http://187.6.167.239/api/"
  ).trim();

  if (envUrl.startsWith("/")) {
    return envUrl.endsWith("/") ? envUrl : `${envUrl}/`;
  }
  const clean = envUrl.replace(/\/+$/, "");
  return clean.endsWith("/api") ? `${clean}/` : `${clean}/api/`;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState, endpoint }) => {

    // 1. NEVER send Authorization header on public auth endpoints
    if (endpoint && PUBLIC_AUTH_ENDPOINTS.includes(endpoint)) {
      headers.delete("Authorization");
      return headers;
    }

    // 2. Check token in Redux state
    const state = getState() as RootStateWithAuth;
    let token = state?.auth?.token;

    // 3. Fallback to localStorage if in browser
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("access_token");
    }

    if (token && token !== "null" && token !== "undefined" && token.trim() !== "") {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const errorData = result.error.data as any;
    const isTokenInvalid =
      errorData?.errors?.code === "token_not_valid" ||
      errorData?.code === "token_not_valid" ||
      (typeof errorData?.errors?.detail === "string" &&
        errorData.errors.detail.toLowerCase().includes("token not valid")) ||
      (typeof errorData?.detail === "string" &&
        errorData.detail.toLowerCase().includes("token not valid"));

    if (isTokenInvalid) {
      // Check if we have a refresh token
      const state = api.getState() as RootStateWithAuth;
      let refreshToken = state?.auth?.refreshToken;
      if (!refreshToken && typeof window !== "undefined") {
        refreshToken = localStorage.getItem("refresh_token");
      }

      if (refreshToken) {
        // Attempt to refresh token
        const refreshResult = await rawBaseQuery(
          {
            url: "token/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const newAccess =
            (refreshResult.data as any).access ||
            (refreshResult.data as any).data?.access;

          if (newAccess) {
            api.dispatch(setCredentials({ token: newAccess, refreshToken }));
            if (typeof window !== "undefined") {
              localStorage.setItem("access_token", newAccess);
            }
            // Retry the original query with the refreshed token
            result = await rawBaseQuery(args, api, extraOptions);
            return result;
          }
        }
      }

      // If refresh failed or was unavailable, clear invalid credentials
      api.dispatch(logout());
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Auth",
    "Dashboard",
    "Users",
    "Bookings",
    "Notifications",
    "FAQs",
    "Support",
    "Documents",
    "Listings",
  ],
  endpoints: () => ({}),
});

