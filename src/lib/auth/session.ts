/**
 * Client-side session indicator cookie helpers.
 *
 * Security model: actual authentication is enforced by the backend's httpOnly
 * session cookie on every API call. This indicator is a lightweight,
 * client-readable cookie used only for fast client-side routing decisions
 * (middleware redirect, avoid flash-of-login-page).
 */

export const SESSION_COOKIE = "lexi-authed";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function setSessionIndicator() {
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearSessionIndicator() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
