/**
 * Auth API surface. The ONLY place that talks to the backend for auth — all
 * endpoints + the `httpClient` live here so components and hooks never call the
 * network directly (CLAUDE.md: components must not call APIs directly).
 */

import { httpClient } from "@/lib/api/http-client";

import type {
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth.dto";

/** `POST /auth/login`. */
export function login(body: LoginRequest): Promise<LoginResponse> {
  return httpClient.post("auth/login", { json: body }).json<LoginResponse>();
}

/** `POST /auth/register`. */
export function register(body: RegisterRequest): Promise<RegisterResponse> {
  return httpClient
    .post("auth/register", { json: body })
    .json<RegisterResponse>();
}

/** `GET /auth/me` — the current session user, or throws `ApiError` (401). */
export function getCurrentUser(): Promise<CurrentUserResponse> {
  return httpClient.get("auth/me").json<CurrentUserResponse>();
}

/** `POST /auth/logout`. */
export function logout(): Promise<void> {
  return httpClient.post("auth/logout").json<void>();
}
