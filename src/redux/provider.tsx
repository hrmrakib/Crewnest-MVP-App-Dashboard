"use client";

import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { setCredentials } from "./features/auth/authSlice";
import { authApi } from "./services/authApi";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && typeof window !== "undefined") {
      initialized.current = true;
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const userStr = localStorage.getItem("user");

      if (token) {
        let user = null;
        if (userStr) {
          try {
            user = JSON.parse(userStr);
          } catch {
            user = null;
          }
        }
        store.dispatch(
          setCredentials({
            token,
            refreshToken,
            user,
          })
        );
        // Fetch fresh profile in the background
        store.dispatch(
          authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })
        );
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
