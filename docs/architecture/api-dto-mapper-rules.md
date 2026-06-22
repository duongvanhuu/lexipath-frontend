# API / DTO / Mapper Rules

The backend is **Java Spring Boot**. The frontend depends only on the HTTP/JSON
**API contract** — never on backend database entities or persistence shapes.

## Three type layers

| Layer            | Location                              | Purpose                                          |
| ---------------- | ------------------------------------- | ------------------------------------------------ |
| **DTO**          | `features/<feature>/api/*.dto.ts`     | Exact Spring Boot JSON contract (wire shape).    |
| **UI/domain**    | `features/<feature>/types/*.ts`       | Component-facing model.                          |
| **Mapper**       | `features/<feature>/api/*.mapper.ts`  | Pure functions `DTO -> UI` (and `UI -> DTO`).    |

### DTO

- Mirrors the backend JSON exactly: field names, nullability, enum strings,
  date strings (ISO-8601), pagination via `PageResponse<T>` from
  `@/lib/api/types`.
- Suffix types with `Dto` (e.g. `VocabItemDto`).
- DTOs are an internal detail of the `api/` folder.

### UI/domain type

- Shaped for the component that renders it: parsed dates (`Date`), derived
  fields, union types, no transport noise.
- Lives in `features/<feature>/types`.

### Mapper

- Pure, side-effect-free `toX(dto): X` functions.
- The only place that knows both shapes. Date parsing, enum narrowing, and
  defaulting happen here.

## Hard rules

- **Components must not call APIs directly.** Calls go through
  `features/<feature>/api/<feature>.api.ts`, which uses
  `@/lib/api/http-client`.
- **Components must not depend on a DTO when its shape differs from UI needs.**
  Consume the mapped UI/domain type instead.
- **Endpoints are owned by `*.api.ts`.** No hardcoded backend URLs/origins in
  components or hooks. The origin comes from
  `NEXT_PUBLIC_API_BASE_URL` via the shared client.
- **Server state lives in TanStack Query hooks** under
  `features/<feature>/hooks/`. Zustand is for local/session UI state only.
- **Validation uses Zod** schemas in `features/<feature>/schemas/`.

## Shared transport types

From `@/lib/api/types`:

- `ApiResponse<T>` — success envelope.
- `ApiErrorResponse` / `ApiFieldError` — Spring error body.
- `PageResponse<T>` — mirrors Spring Data `Page<T>`.
- `PaginationParams`, `SortParam`, `SortDirection` — `Pageable` query params.
- `toSearchParams(params)` — serializes pagination/sort for ky `searchParams`
  (`?sort=field,asc`).
- `isApiErrorResponse(value)` — runtime guard.

Errors thrown by the client are `ApiError` (`@/lib/api/api-error`), carrying
`status`, `code`, and `fieldErrors` — independent of the transport library.

## Example flow

```ts
// api/vocabulary.dto.ts
export interface VocabItemDto {
  id: string;
  word: string;
  createdAt: string; // ISO-8601
}

// types/vocab-item.ts
export interface VocabItem {
  id: string;
  word: string;
  createdAt: Date;
}

// api/vocabulary.mapper.ts
export const toVocabItem = (dto: VocabItemDto): VocabItem => ({
  id: dto.id,
  word: dto.word,
  createdAt: new Date(dto.createdAt),
});

// api/vocabulary.api.ts
import { httpClient } from "@/lib/api/http-client";
import type { PageResponse } from "@/lib/api/types";
export const fetchVocabulary = (page = 0) =>
  httpClient.get("vocabulary", { searchParams: { page } }).json<PageResponse<VocabItemDto>>();

// hooks/use-vocabulary.ts -> TanStack Query, maps DTO -> VocabItem
```
