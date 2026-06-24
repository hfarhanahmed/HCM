"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchSingleBalance } from "@/lib/api-client";
import { balanceKey } from "@/lib/query-keys";

const STALE_THRESHOLD_MS = 30_000;
const BONUS_MESSAGE = "Work Anniversary Bonus Applied!";

export function useBalances(empId: string, locId: string) {
  const previousDaysRef = useRef<number | null>(null);
  const [bonusMessage, setBonusMessage] = useState<string | undefined>();

  const query = useQuery({
    queryKey: balanceKey(empId, locId),
    queryFn: () => fetchSingleBalance(empId, locId),
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data === undefined) {
      return;
    }

    const previousDays = previousDaysRef.current;

    if (previousDays !== null && query.data.days > previousDays) {
      setBonusMessage(BONUS_MESSAGE);
    } else if (previousDays !== null && query.data.days <= previousDays) {
      setBonusMessage(undefined);
    }

    previousDaysRef.current = query.data.days;
  }, [query.data]);

  const isStale =
    (query.isFetching && !query.isLoading) ||
    (query.dataUpdatedAt > 0 &&
      Date.now() - query.dataUpdatedAt > STALE_THRESHOLD_MS);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isStale,
    bonusMessage,
    lastUpdated: query.dataUpdatedAt ? new Date(query.dataUpdatedAt) : new Date(),
  };
}
