"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import * as authApi from "../api/auth.api";
import { mapCurrentUser } from "../api/auth.mapper";
import type { LoginRequest, RegisterRequest } from "../api/auth.dto";
import type { AuthUser } from "../types/auth.types";
import {
  setSessionIndicator,
  clearSessionIndicator,
} from "@/lib/auth/session";

/** Query keys for the auth feature. */
export const authKeys = {
  me: ["auth", "me"] as const,
};

/** Read the current session user (mapped to the UI model). */
export function useCurrentUser() {
  return useQuery<AuthUser>({
    queryKey: authKeys.me,
    queryFn: async () => mapCurrentUser(await authApi.getCurrentUser()),
    retry: false,
  });
}

/** Log in, then prime the `me` cache with the returned user and set session indicator. */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (res) => {
      queryClient.setQueryData(authKeys.me, mapCurrentUser(res.user));
      setSessionIndicator();
    },
  });
}

/** Register a new account. */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => authApi.register(body),
  });
}

/** Log out: call backend, clear cache and session indicator, redirect to login. */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.me });
      clearSessionIndicator();
      router.push("/login");
    },
    onError: () => {
      // Clear client state even if the backend call fails
      queryClient.removeQueries({ queryKey: authKeys.me });
      clearSessionIndicator();
      router.push("/login");
    },
  });
}
