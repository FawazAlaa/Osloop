import { Counters } from "@/lib/interfaces/counters";
import { useQuery } from "@tanstack/react-query";

async function fetchAnalytics(): Promise<Counters> {
  const res = await fetch("/api/dashboard-stats");
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
  });
}
