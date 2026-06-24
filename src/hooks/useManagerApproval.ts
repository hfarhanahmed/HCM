"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { fetchSingleBalance } from "@/lib/api-client";
import type { VerificationState } from "@/components/types";

type VerifyBalanceVariables = {
  empId: string;
  locId: string;
  requiredDays: number;
};

export function useManagerApproval() {
  const [verificationState, setVerificationState] =
    useState<VerificationState>("unverified");
  const [currentLiveBalance, setCurrentLiveBalance] = useState<number | null>(
    null,
  );

  const mutation = useMutation({
    mutationFn: async ({
      empId,
      locId,
      requiredDays,
    }: VerifyBalanceVariables) => {
      const balance = await fetchSingleBalance(empId, locId);

      return {
        currentLiveBalance: balance.days,
        verificationState:
          balance.days >= requiredDays
            ? ("verified-sufficient" as const)
            : ("verified-insufficient" as const),
      };
    },
    onMutate: () => {
      setVerificationState("verifying");
      setCurrentLiveBalance(null);
    },
    onSuccess: (result) => {
      setCurrentLiveBalance(result.currentLiveBalance);
      setVerificationState(result.verificationState);
    },
    onError: () => {
      setVerificationState("unverified");
      setCurrentLiveBalance(null);
    },
  });

  const verifyBalance = useCallback(
    (empId: string, locId: string, requiredDays: number) =>
      mutation.mutateAsync({ empId, locId, requiredDays }),
    [mutation],
  );

  const resetVerification = useCallback(() => {
    setVerificationState("unverified");
    setCurrentLiveBalance(null);
  }, []);

  return {
    verificationState,
    currentLiveBalance,
    verifyBalance,
    isVerifying: mutation.isPending,
    resetVerification,
  };
}
