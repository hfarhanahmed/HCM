import type { BalanceStatus } from "./types";

export type BalanceCardProps = {
  empId: string;
  locId: string;
  daysAvailable: number;
  status: BalanceStatus;
  lastUpdated: Date;
  bonusMessage?: string;
};

function formatLastUpdated(date: Date): string {
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }: { status: BalanceStatus }) {
  if (status === "idle" || status === "loading") {
    return null;
  }

  const badgeStyles: Record<Exclude<BalanceStatus, "idle" | "loading">, string> = {
    syncing: "bg-blue-100 text-blue-800",
    stale: "bg-amber-100 text-amber-800",
    discrepancy: "bg-red-100 text-red-800",
  };

  const labels: Record<Exclude<BalanceStatus, "idle" | "loading">, string> = {
    syncing: "Syncing...",
    stale: "May be outdated",
    discrepancy: "Discrepancy detected",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeStyles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-zinc-200 ${className ?? ""}`}
    />
  );
}

export function BalanceCard({
  empId,
  locId,
  daysAvailable,
  status,
  lastUpdated,
  bonusMessage,
}: BalanceCardProps) {
  const isLoading = status === "loading";
  const isEmpty = !isLoading && daysAvailable === 0;
  const isDiscrepancy = status === "discrepancy";

  const cardClassName = [
    "rounded-lg border p-4 shadow-sm transition-colors",
    isDiscrepancy
      ? "border-red-300 bg-red-50"
      : status === "stale"
        ? "border-amber-200 bg-amber-50/40"
        : "border-zinc-200 bg-white",
  ].join(" ");

  return (
    <article
      className={cardClassName}
      aria-busy={isLoading}
      aria-labelledby={`balance-card-title-${empId}-${locId}`}
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          {isLoading ? (
            <>
              <SkeletonBlock className="mb-2 h-4 w-32" />
              <SkeletonBlock className="h-3 w-24" />
            </>
          ) : (
            <>
              <h2
                id={`balance-card-title-${empId}-${locId}`}
                className="text-sm font-medium text-zinc-900"
              >
                Time Off Balance
              </h2>
              <p className="text-xs text-zinc-500">
                {empId} · {locId}
              </p>
            </>
          )}
        </div>
        {!isLoading && <StatusBadge status={status} />}
      </header>

      <div className="min-h-[2.5rem]">
        {bonusMessage ? (
          <div
            role="status"
            aria-live="polite"
            className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
          >
            {bonusMessage}
          </div>
        ) : null}
      </div>

      {isDiscrepancy && !isLoading ? (
        <div
          role="alert"
          className="mb-3 rounded-md border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800"
        >
          Balance differs from HCM source of truth. Reconcile before submitting
          new requests.
        </div>
      ) : null}

      <div className="mb-3">
        {isLoading ? (
          <SkeletonBlock className="h-10 w-20" />
        ) : isEmpty ? (
          <p className="text-lg font-semibold text-zinc-500">
            No time off available
          </p>
        ) : (
          <p className="text-3xl font-semibold text-zinc-900">
            {daysAvailable}
            <span className="ml-1 text-base font-normal text-zinc-500">
              {daysAvailable === 1 ? "day" : "days"}
            </span>
          </p>
        )}
      </div>

      <footer>
        {isLoading ? (
          <SkeletonBlock className="h-3 w-40" />
        ) : (
          <p className="text-xs text-zinc-500">
            Last updated: {formatLastUpdated(lastUpdated)}
          </p>
        )}
      </footer>
    </article>
  );
}
