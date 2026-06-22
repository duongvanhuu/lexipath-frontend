/**
 * DTO → UI mappers for auth. Components depend on `AuthUser`, never on the
 * backend `CurrentUserResponse` shape (which uses `fullName`, nullable fields,
 * etc.). Keep all field-name translation here.
 */

import type { AuthUser } from "../types/auth.types";
import type { CurrentUserResponse } from "./auth.dto";

/** Map the backend user record to the UI `AuthUser` model. */
export function mapCurrentUser(dto: CurrentUserResponse): AuthUser {
  return {
    id: dto.id,
    name: dto.fullName,
    email: dto.email,
    emailVerified: dto.emailVerified,
    ...(dto.avatarUrl ? { avatarUrl: dto.avatarUrl } : {}),
    ...(dto.provider ? { provider: dto.provider } : {}),
  };
}
