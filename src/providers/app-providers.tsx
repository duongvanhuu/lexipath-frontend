"use client";

import * as React from "react";

import { QueryProvider } from "./query-provider";
import { ToasterProvider } from "./toaster";

/**
 * AppProviders — the single client boundary mounted at the root. Composes the
 * TanStack Query client and the toast surface so Server Components above stay
 * server-only.
 */
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <ToasterProvider />
    </QueryProvider>
  );
}

export { AppProviders };
