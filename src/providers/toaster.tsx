"use client";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";

/**
 * App-level toast surface. Mount once near the root layout. Toasts are emitted
 * imperatively with `toast()` from `@/components/shared` (re-exported from
 * sonner) — replacing the prototype `Toast` / `SuccessToast` components.
 */
function ToasterProvider() {
  return <SonnerToaster position="bottom-right" richColors closeButton />;
}

export { ToasterProvider };
