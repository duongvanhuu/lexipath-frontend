import ky, { HTTPError } from "ky";

import { ApiError } from "./api-error";

// ky v2 renamed the old `prefixUrl` option to `baseUrl`. Relative request
// paths (e.g. "vocabulary") are resolved against this base URL. Endpoints are
// owned by feature `*.api.ts` files — never hardcode the origin in components.
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (process.env.NODE_ENV === "production" && !baseUrl) {
  throw new Error(
    "[LexiPath] NEXT_PUBLIC_API_BASE_URL is not set. Configure this env var before deploying."
  );
}

/**
 * Shared HTTP client for the LexiPath (Spring Boot) backend.
 *
 * - `credentials: "include"` so the session cookie rides along.
 * - `beforeError` normalizes ky's `HTTPError` into our `ApiError`, parsing the
 *   Spring error body for `message` / `code` / `fieldErrors`.
 *
 * Consume via feature `*.api.ts`:  `httpClient.get("vocabulary").json<...>()`.
 */
export const httpClient = ky.create({
  ...(baseUrl ? { baseUrl } : {}),
  credentials: "include",
  retry: { limit: 2, methods: ["get"] },
  headers: { Accept: "application/json" },
  hooks: {
    beforeError: [
      async ({ error }) => {
        if (!(error instanceof HTTPError)) return error;

        const { response } = error;
        let body: unknown;
        try {
          body = await response.clone().json();
        } catch {
          body = undefined;
        }

        return ApiError.fromBody(
          response.status,
          body,
          error.message || response.statusText || "Request failed"
        );
      },
    ],
  },
});
