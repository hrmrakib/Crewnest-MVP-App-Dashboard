import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CustomUser } from "../../types/auth.types";

interface AuthState {
  user: CustomUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state, retrieving token/user from localStorage if in client
const getInitialState = (): AuthState => {
  let token: string | null = null;
  let refreshToken: string | null = null;
  let user: CustomUser | null = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
    refreshToken = localStorage.getItem("refresh_token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {
        user = null;
      }
    }
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated: Boolean(token),
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user?: CustomUser | null;
        token?: string | null;
        refreshToken?: string | null;
      }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      if (token !== undefined) {
        state.token = token;
        state.isAuthenticated = Boolean(token);
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("access_token", token);
          } else {
            localStorage.removeItem("access_token");
          }
        }
      }
      if (refreshToken !== undefined) {
        state.refreshToken = refreshToken;
        if (typeof window !== "undefined") {
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          } else {
            localStorage.removeItem("refresh_token");
          }
        }
      }
      if (user !== undefined) {
        state.user = user;
        if (typeof window !== "undefined") {
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            localStorage.removeItem("user");
          }
        }
      }
      state.error = null;
    },
    setUser: (state, action: PayloadAction<CustomUser | null>) => {
      state.user = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  setLoading,
  setError,
  clearError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
