"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // create once per browser session
  const queryClient =new QueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}