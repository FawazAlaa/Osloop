
import { useQuery } from "@tanstack/react-query";
import { GlobalCounters } from "@/lib/interfaces/user";

async function fetchAnalytics(): Promise<GlobalCounters> {
  const res = await fetch("/api/dashboard-all");
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export function useAnalyticsAll() {
  return useQuery({
    queryKey: ["analyticsAll"],
    queryFn: fetchAnalytics,
  });
}