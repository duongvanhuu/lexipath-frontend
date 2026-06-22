/**
 * Core API types shared across features.
 *
 * These describe the transport-level contract with the Java Spring Boot
 * backend. They are NOT UI/domain models — feature DTOs extend these and are
 * mapped to UI types in `features/<feature>/api/*.mapper.ts`.
 *
 * The frontend depends only on the HTTP/JSON contract, never on backend
 * database entities.
 */

/** Successful response envelope. `T` is the feature DTO payload. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  /** ISO-8601 timestamp from the server. */
  timestamp?: string;
}

/** A single field-level validation error from Spring (e.g. Bean Validation). */
export interface ApiFieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
  code?: string;
}

/**
 * Error response body. Covers both Spring's default error attributes and a
 * common custom envelope (`code` + `fieldErrors`). All non-`status` fields are
 * optional because the exact shape varies by backend configuration.
 */
export interface ApiErrorResponse {
  status: number;
  error?: string;
  message?: string;
  /** Application-specific error code (e.g. "VOCAB_NOT_FOUND"). */
  code?: string;
  path?: string;
  timestamp?: string;
  fieldErrors?: ApiFieldError[];
  details?: unknown;
}

/** Sort direction matching Spring Data's `Sort.Direction`. */
export type SortDirection = "asc" | "desc";

/** A single sort instruction. Serialized as `sort=field,direction`. */
export interface SortParam {
  field: string;
  direction?: SortDirection;
}

/** Query params for paginated, sorted list endpoints (Spring `Pageable`). */
export interface PaginationParams {
  /** Zero-based page index, matching Spring `Pageable.pageNumber`. */
  page?: number;
  /** Page size, matching Spring `Pageable.pageSize`. */
  size?: number;
  sort?: SortParam | SortParam[];
}

/** Sort metadata Spring includes on a `Page`. */
export interface PageSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

/**
 * Paginated response matching Spring Data's `Page<T>` JSON shape. `T` is the
 * element DTO.
 */
export interface PageResponse<T> {
  content: T[];
  /** Zero-based current page index. */
  number: number;
  /** Page size requested. */
  size: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort?: PageSort;
}

/** Narrowing guard for an unknown error body. */
export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof (value as { status: unknown }).status === "number"
  );
}

/**
 * Serialize pagination params into a flat record suitable for ky's
 * `searchParams`. Sort is emitted as repeated `field,direction` entries the way
 * Spring expects (`?sort=word,asc&sort=createdAt,desc`).
 */
export function toSearchParams(params: PaginationParams): [string, string][] {
  const entries: [string, string][] = [];

  if (params.page !== undefined) entries.push(["page", String(params.page)]);
  if (params.size !== undefined) entries.push(["size", String(params.size)]);

  const sorts = params.sort
    ? Array.isArray(params.sort)
      ? params.sort
      : [params.sort]
    : [];

  for (const sort of sorts) {
    entries.push([
      "sort",
      sort.direction ? `${sort.field},${sort.direction}` : sort.field,
    ]);
  }

  return entries;
}
