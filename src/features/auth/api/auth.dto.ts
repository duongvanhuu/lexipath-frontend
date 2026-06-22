/**
 * Auth DTOs — the JSON contract with the Java Spring Boot backend. These mirror
 * the wire shape exactly; they are NOT the UI model (see `../types/auth.types`).
 * Map DTO → UI in `auth.mapper.ts`.
 *
 * NOTE: these are example contracts pending the final backend spec. Adjust field
 * names here (and only here + the mapper) when the real contract lands.
 */

import type { AuthProvider } from "../types/auth.types";

/** `POST /auth/login` request body. */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** The authenticated user as the backend serializes it. */
export interface CurrentUserResponse {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  avatarUrl?: string | null;
  provider?: AuthProvider | null;
  /** ISO-8601 timestamp. */
  createdAt?: string;
}

/** `POST /auth/login` response. JWT bearer token + the user record. */
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  /** Seconds until the access token expires. */
  expiresIn?: number;
  user: CurrentUserResponse;
}

/** `POST /auth/register` request body. */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

/** `POST /auth/register` response. */
export interface RegisterResponse {
  user: CurrentUserResponse;
  /** When true, the client should route into the email-verification flow. */
  verificationRequired: boolean;
}
