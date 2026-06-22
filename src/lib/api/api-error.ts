import { isApiErrorResponse, type ApiFieldError } from "./types";

/**
 * Normalized API error thrown by the HTTP client. Components/hooks catch this
 * instead of ky's raw `HTTPError`, so error handling does not depend on the
 * transport library.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly fieldErrors?: ApiFieldError[],
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** True for 4xx responses (client errors). */
  get isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }

  /** True for 5xx responses (server errors). */
  get isServerError(): boolean {
    return this.status !== undefined && this.status >= 500;
  }

  /** Build an ApiError from a parsed error body + HTTP status. */
  static fromBody(status: number, body: unknown, fallbackMessage: string): ApiError {
    if (isApiErrorResponse(body)) {
      return new ApiError(
        body.message ?? body.error ?? fallbackMessage,
        body.status ?? status,
        body.code,
        body.fieldErrors,
        body.details
      );
    }
    return new ApiError(fallbackMessage, status);
  }
}
