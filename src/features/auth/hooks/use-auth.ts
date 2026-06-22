"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import * as authApi from "../api/auth.api";
import { mapCurrentUser } from "../api/auth.mapper";
import type { LoginRequest, RegisterRequest } from "../api/auth.dto";
import type { AuthUser } from "../types/auth.types";

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

/** Log in, then prime the `me` cache with the returned user. */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (res) => {
      queryClient.setQueryData(authKeys.me, mapCurrentUser(res.user));
    },
  });
}

/** Register a new account. */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: (body: RegisterRequest) => authApi.register(body),
  });
}
