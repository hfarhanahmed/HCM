import type { PendingRequest, VerificationState } from "./types";

export type ManagerReviewCardProps = {
  request: PendingRequest;
  verificationState: VerificationState;
  currentLiveBalance: number | null;
  onVerify: () => void;
  onApprove: () => void;
  onDeny: () => void;
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-transparent"
    />
  );
}

export function ManagerReviewCard({
  request,
  verificationState,
  currentLiveBalance,
  onVerify,
  onApprove,
  onDeny,
}: ManagerReviewCardProps) {
  const isVerified =
    verificationState === "verified-sufficient" ||
    verificationState === "verified-insufficient";
  const isVerifying = verificationState === "verifying";
  const canApprove = verificationState === "verified-sufficient";
  const canDeny = isVerified;

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-4">
        <h2 className="text-sm font-medium text-zinc-900">
          Pending Time Off Request
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Pessimistic review — verify live HCM balance before acting
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-zinc-500">Employee</dt>
          <dd className="font-medium text-zinc-900">{request.empId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Location</dt>
          <dd className="font-medium text-zinc-900">{request.locId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Days requested</dt>
          <dd className="font-medium text-zinc-900">{request.daysRequested}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
        {isVerified && currentLiveBalance !== null ? (
          <div>
            <p className="text-sm font-medium text-zinc-900">
              Live HCM balance: {currentLiveBalance}{" "}
              {currentLiveBalance === 1 ? "day" : "days"}
            </p>
            <p
              className={`mt-1 text-sm ${
                verificationState === "verified-sufficient"
                  ? "text-emerald-700"
                  : "text-red-700"
              }`}
            >
              {verificationState === "verified-sufficient"
                ? "Sufficient balance to approve this request."
                : "Insufficient balance — approval would exceed available days."}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-600">
            Verify the employee&apos;s current balance with HCM before approving
            or denying.
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onVerify}
          disabled={isVerifying || isVerified}
          aria-busy={isVerifying}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Spinner />
              Verifying...
            </>
          ) : (
            "Verify balance"
          )}
        </button>

        <button
          type="button"
          onClick={onApprove}
          disabled={!canApprove}
          className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Approve
        </button>

        <button
          type="button"
          onClick={onDeny}
          disabled={!canDeny}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Deny
        </button>
      </div>
    </article>
  );
}
