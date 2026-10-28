import { apiSlice } from "./apiSlice";
import { setCredentials, setUser, logout } from "../features/auth/authSlice";
import type {
  CustomUser,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyForgotPasswordOTPRequest,
  VerifyForgotPasswordOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LogoutRequest,
  LogoutResponse,
} from "../types/auth.types";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      async queryFn(credentials, _queryApi, _extraOptions, fetchWithBQ) {
        // 1. First attempt to call v1/users/login/
        const loginResult = await fetchWithBQ({
          url: "v1/users/login/",
          method: "POST",
          body: credentials,
        });

        if (loginResult.error) {
          // If login endpoint returned 404, fallback to token/
          if (loginResult.error.status === 404) {
            const tokenResult = await fetchWithBQ({
              url: "token/",
              method: "POST",
              body: credentials,
            });
            if (tokenResult.error) {
              return { error: tokenResult.error };
            }
            return { data: tokenResult.data as LoginResponse };
          }
          return { error: loginResult.error };
        }

        const data = loginResult.data as Record<string, any>;
        const rawNested = (data?.data && typeof data.data === "object" ? data.data : null) as Record<string, any> | null;

        const hasToken =
          data?.access ||
          data?.token ||
          data?.tokens?.access ||
          rawNested?.access ||
          rawNested?.token;

        // If login succeeded but didn't include access token, fetch from token/
        if (!hasToken) {
          const tokenResult = await fetchWithBQ({
            url: "token/",
            method: "POST",
            body: credentials,
          });

          if (tokenResult.data) {
            const tokenData = tokenResult.data as Record<string, any>;
            return {
              data: {
                ...data,
                access: tokenData.access,
                refresh: tokenData.refresh,
                tokens: {
                  access: tokenData.access,
                  refresh: tokenData.refresh,
                },
              } as LoginResponse,
            };
          }
        }

        return { data: data as LoginResponse };
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Extract token from common response structures
          const rawData = data as Record<string, unknown>;
          const nestedData = (rawData.data && typeof rawData.data === "object" ? rawData.data : null) as Record<string, unknown> | null;

          const token: string | null =
            data.access ||
            data.token ||
            data.tokens?.access ||
            (typeof nestedData?.access === "string" ? nestedData.access : null) ||
            (typeof nestedData?.token === "string" ? nestedData.token : null) ||
            null;

          const refreshToken: string | null =
            data.refresh ||
            data.tokens?.refresh ||
            (typeof nestedData?.refresh === "string" ? nestedData.refresh : null) ||
            null;

          // Extract user object or create from root response
          let user: CustomUser | null = null;
          if (data.user) {
            user = data.user;
          } else if (nestedData?.user && typeof nestedData.user === "object") {
            user = nestedData.user as CustomUser;
          } else if (data.id && data.email) {
            user = {
              id: data.id,
              full_name: data.full_name || null,
              email: data.email,
              role: data.role,
              profile_picture: data.profile_picture || null,
            };
          }

          dispatch(
            setCredentials({
              token,
              refreshToken,
              user,
            })
          );

          // If we received a token, fetch the latest user profile
          if (token) {
            dispatch(authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }));
          }
        } catch {
          // Handled by component
        }
      },
    }),


    getProfile: builder.query<CustomUser, void>({
      query: () => ({
        url: "v1/users/profile/",
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse: (
        response: { success?: boolean; data?: CustomUser } | CustomUser
      ): CustomUser => {
        if ("data" in response && response.data) {
          return response.data;
        }
        return response as CustomUser;
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // Token might be invalid or expired
        }
      },
    }),

    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "v1/users/forgot-password/",
        method: "POST",
        body,
      }),
    }),

    verifyForgotPassword: builder.mutation<
      VerifyForgotPasswordOTPResponse,
      VerifyForgotPasswordOTPRequest
    >({
      query: (body) => ({
        url: "v1/users/verify-forgot-password/",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "v1/users/reset-password/",
        method: "POST",
        body: {
          new_password: body.new_password,
          confirm_password: body.confirm_password,
        },
      }),
    }),

    logoutUser: builder.mutation<LogoutResponse, LogoutRequest>({
      query: (body) => ({
        url: "v1/users/logout/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useForgotPasswordMutation,
  useVerifyForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
} = authApi;
