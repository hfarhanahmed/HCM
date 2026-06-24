export type BalanceCell = {
  empId: string;
  locId: string;
  days: number;
};

export type BatchResponse = {
  balances: BalanceCell[];
  asOf: string;
};

export type BalanceResponse = {
  empId: string;
  locId: string;
  days: number;
};

export type TimeOffRequest = {
  empId: string;
  locId: string;
  days: number;
};

export type ChaosMode =
  | "success"
  | "insufficient"
  | "silent_failure"
  | "timeout";

export type RequestSuccessResponse = {
  status: "approved";
  empId: string;
  locId: string;
  daysRequested: number;
  remainingBalance: number;
};

export type ApiErrorResponse = {
  error: string;
};

export type DeductBalanceResult =
  | { ok: true; remaining: number }
  | { ok: false; reason: "not_found" | "insufficient" };
