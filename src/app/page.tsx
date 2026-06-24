"use client";

import { useState } from "react";
import { BalanceCard } from "@/components/BalanceCard";
import { ManagerReviewCard } from "@/components/ManagerReviewCard";
import { TimeOffRequestForm } from "@/components/TimeOffRequestForm";
import type { BalanceStatus } from "@/components/types";
import { useBalances } from "@/hooks/useBalances";
import { useManagerApproval } from "@/hooks/useManagerApproval";
import { useSubmitRequest } from "@/hooks/useSubmitRequest";
import type { ChaosMode } from "@/lib/hcm/types";

const EMP_ID = "emp-001";
const LOC_ID = "loc-us";

const MOCK_PENDING_REQUEST = {
  empId: EMP_ID,
  locId: LOC_ID,
  daysRequested: 2,
};

const CHAOS_MODES: { label: string; value: ChaosMode | "default" }[] = [
  { label: "Default / Success", value: "default" },
  { label: "Insufficient", value: "insufficient" },
  { label: "Silent Failure", value: "silent_failure" },
  { label: "Timeout", value: "timeout" },
];

function resolveBalanceStatus(
  isLoading: boolean,
  hasDiscrepancy: boolean,
  isSubmitting: boolean,
  isStale: boolean,
): BalanceStatus {
  if (isLoading) {
    return "loading";
  }

  if (hasDiscrepancy) {
    return "discrepancy";
  }

  if (isSubmitting) {
    return "syncing";
  }

  if (isStale) {
    return "stale";
  }

  return "idle";
}

export default function Home() {
  const [chaosMode, setChaosMode] = useState<ChaosMode | undefined>(undefined);

  const {
    data: balance,
    isLoading,
    isStale,
    bonusMessage,
    lastUpdated,
  } = useBalances(EMP_ID, LOC_ID);

  const {
    mutate: submitRequest,
    isPending: isSubmitting,
    error: submitError,
    hasDiscrepancy,
  } = useSubmitRequest();

  const {
    verificationState,
    currentLiveBalance,
    verifyBalance,
  } = useManagerApproval();

  const balanceStatus = resolveBalanceStatus(
    isLoading,
    hasDiscrepancy,
    isSubmitting,
    isStale,
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">ExampleHR Time Off</h1>
        <p className="text-sm text-zinc-600">
          Employee dashboard and manager review wired to the HCM mock API.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Employee</h2>

        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-sm font-medium text-zinc-700">
            Chaos mode (for manual testing)
          </p>
          <div className="flex flex-wrap gap-2">
            {CHAOS_MODES.map((mode) => (
              <button
                key={mode.value}
                type="button"
                onClick={() =>
                  setChaosMode(
                    mode.value === "default" ? undefined : mode.value,
                  )
                }
                className={`rounded-md px-3 py-1.5 text-sm ${
                  (mode.value === "default" && chaosMode === undefined) ||
                  chaosMode === mode.value
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-700"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BalanceCard
            empId={EMP_ID}
            locId={LOC_ID}
            daysAvailable={balance?.days ?? 0}
            status={balanceStatus}
            lastUpdated={lastUpdated}
            bonusMessage={bonusMessage}
          />

          <TimeOffRequestForm
            availableDays={balance?.days ?? 0}
            isSubmitting={isSubmitting}
            error={submitError}
            onSubmit={(days) =>
              submitRequest({
                empId: EMP_ID,
                locId: LOC_ID,
                days,
                chaosMode,
              })
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Manager</h2>

        <ManagerReviewCard
          request={MOCK_PENDING_REQUEST}
          verificationState={verificationState}
          currentLiveBalance={currentLiveBalance}
          onVerify={() =>
            verifyBalance(
              MOCK_PENDING_REQUEST.empId,
              MOCK_PENDING_REQUEST.locId,
              MOCK_PENDING_REQUEST.daysRequested,
            )
          }
          onApprove={() => {
            console.log("Approve request", MOCK_PENDING_REQUEST);
          }}
          onDeny={() => {
            console.log("Deny request", MOCK_PENDING_REQUEST);
          }}
        />
      </section>
    </main>
  );
}
