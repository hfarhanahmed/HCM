"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchSingleBalance, submitTimeOffRequest } from "@/lib/api-client";
import type { BalanceResponse, ChaosMode } from "@/lib/hcm/types";
import { balanceKey } from "@/lib/query-keys";

type SubmitRequestVariables = {
  empId: string;
  locId: string;
  days: number;
  chaosMode?: ChaosMode;
};

type SubmitRequestContext = {
  previousBalance: BalanceResponse | undefined;
  expectedBalance: number;
};

export function useSubmitRequest() {
  const queryClient = useQueryClient();
  const [hasDiscrepancy, setHasDiscrepancy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = useMutation({
    mutationFn: ({ empId, locId, days, chaosMode }: SubmitRequestVariables) =>
      submitTimeOffRequest({ empId, locId, days }, chaosMode),
    onMutate: async ({ empId, locId, days }) => {
      setHasDiscrepancy(false);
      setErrorMessage(undefined);

      const key = balanceKey(empId, locId);

      await queryClient.cancelQueries({ queryKey: key });

      const previousBalance = queryClient.getQueryData<BalanceResponse>(key);
      const currentDays = previousBalance?.days ?? 0;
      const expectedBalance = currentDays - days;

      if (previousBalance) {
        queryClient.setQueryData<BalanceResponse>(key, {
          ...previousBalance,
          days: expectedBalance,
        });
      }

      return {
        previousBalance,
        expectedBalance,
      } satisfies SubmitRequestContext;
    },
    onError: (error, { empId, locId }, context) => {
      if (context?.previousBalance) {
        queryClient.setQueryData(
          balanceKey(empId, locId),
          context.previousBalance,
        );
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Request failed",
      );
    },
    onSettled: async (_data, error, { empId, locId }, context) => {
      const key = balanceKey(empId, locId);

      await queryClient.invalidateQueries({ queryKey: key });

      if (error || !context) {
        return;
      }

      const freshBalance = await queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => fetchSingleBalance(empId, locId),
      });

      if (freshBalance.days !== context.expectedBalance) {
        setHasDiscrepancy(true);
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: errorMessage,
    hasDiscrepancy,
    resetDiscrepancy: () => setHasDiscrepancy(false),
  };
}
