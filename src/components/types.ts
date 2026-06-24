export type BalanceStatus =
  | "loading"
  | "idle"
  | "syncing"
  | "stale"
  | "discrepancy";

export type VerificationState =
  | "unverified"
  | "verifying"
  | "verified-sufficient"
  | "verified-insufficient";

export type PendingRequest = {
  empId: string;
  locId: string;
  daysRequested: number;
};
